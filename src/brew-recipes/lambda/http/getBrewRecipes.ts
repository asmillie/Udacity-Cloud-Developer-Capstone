import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { getUserId, prepareApiResponse } from "../../../utils/api";
import { saveExecutionTimeMetric } from "../../../utils/metrics";
import { BrewRecipeRepository } from "../../brew-recipe.repository";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startTimeMS = new Date().getTime();
    const userId = getUserId(event);
    const brewRecipeRepository = new BrewRecipeRepository();
    const response = await brewRecipeRepository.getAllBrewRecipesByUserId(userId)
        .then(recipes => {
            return prepareApiResponse(200, { recipes });
        })
        .catch(error => {
            return prepareApiResponse(400, { error })
        });

    await saveExecutionTimeMetric('GetBrewRecipes', startTimeMS);

    return response;
}