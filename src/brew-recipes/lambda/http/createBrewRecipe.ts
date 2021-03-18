import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { getUserId, prepareApiResponse } from "../../../utils/api";
import { saveExecutionTimeMetric } from "../../../utils/metrics";
import { BrewRecipeRepository } from "../../brew-recipe.repository";
import { CreateBrewRecipeRequest } from "../../requests/CreateBrewRecipeRequest";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startTimeMS = new Date().getTime();
    const userId = getUserId(event);
    const createBrewRecipeReq: CreateBrewRecipeRequest = JSON.parse(event.body);

    const brewRecipeRepository = new BrewRecipeRepository();

    const response = await brewRecipeRepository.createBrewRecipe(userId, createBrewRecipeReq)
        .then(recipe => {
            return prepareApiResponse(201, { recipe });
        })
        .catch(error => {
            return prepareApiResponse(400, { error });
        });   

    await saveExecutionTimeMetric('CreateBrewRecipe', startTimeMS);
    return response;
}