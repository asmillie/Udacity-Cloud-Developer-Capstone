import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { prepareApiResponse } from "../../../utils/api";
import { saveExecutionTimeMetric } from "../../../utils/metrics";
import { RecipeStepRepository } from "../../recipe-step.repository";
import { CreateRecipeStepRequest } from "../../requests/CreateRecipeStepRequest";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startTimeMS = new Date().getTime();
    const recipeId = event.pathParameters.recipeId;
    const createRecipeStepRequest: CreateRecipeStepRequest = JSON.parse(event.body);

    const recipeStepRepository = new RecipeStepRepository();

    const response = await recipeStepRepository.createRecipeStep(recipeId, createRecipeStepRequest)
        .then(step => {
            return prepareApiResponse(201, { step });
        })
        .catch(error => {
            return prepareApiResponse(400, { error })
        });

    await saveExecutionTimeMetric('CreateRecipeStep', startTimeMS);

    return response;
}