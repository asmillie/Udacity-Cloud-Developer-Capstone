import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { getUserId, prepareApiResponse } from "../../../utils/api";
import { saveExecutionTimeMetric } from "../../../utils/metrics";
import { BrewRecipeRepository } from "../../brew-recipe.repository";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startTimeMS = new Date().getTime();
    const userId = getUserId(event);
    const recipeId = event.pathParameters.recipeId;

    const brewRecipeRepository = new BrewRecipeRepository();
    const recipe = await brewRecipeRepository.deleteBrewRecipeById(userId, recipeId);

    await saveExecutionTimeMetric('DeleteBrewRecipe', startTimeMS);

    return prepareApiResponse(200, { recipe });
}