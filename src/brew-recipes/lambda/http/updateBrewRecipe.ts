import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { getUserId, prepareApiResponse } from "../../../utils/api";
import { saveExecutionTimeMetric } from "../../../utils/metrics";
import { BrewRecipeRepository } from "../../brew-recipe.repository";
import { UpdateBrewRecipeRequest } from "../../requests/UpdateBrewRecipeRequest";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startTimeMS = new Date().getTime();
    const userId = getUserId(event);
    const recipeId = event.pathParameters.recipeId;
    const updateBrewRecipeReq: UpdateBrewRecipeRequest = JSON.parse(event.body);

    const brewRecipeRepository = new BrewRecipeRepository();
    const response = await brewRecipeRepository.updateBrewRecipe(userId, recipeId, updateBrewRecipeReq)
        .then(recipe => {
            return prepareApiResponse(200, { recipe });
        })
        .catch(error => {
            return prepareApiResponse(400, { error })
        });

    await saveExecutionTimeMetric('UpdateBrewRecipe', startTimeMS);

    return response;
}