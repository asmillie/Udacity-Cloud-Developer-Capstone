import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { prepareApiResponse } from "../../../utils/api";
import { saveExecutionTimeMetric } from "../../../utils/metrics";
import { RecipeStepRepository } from "../../recipe-step.repository";
import { UpdateRecipeStepRequest } from "../../requests/UpdateRecipeStepRequest";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startTimeMS = new Date().getTime();
    const recipeId = event.pathParameters.recipeId;
    const stepId = event.pathParameters.stepId;
    const updateRecipeStepRequest: UpdateRecipeStepRequest = JSON.parse(event.body);

    const recipeStepRepository = new RecipeStepRepository();
    const response = await recipeStepRepository.updateRecipeStep(recipeId, stepId, updateRecipeStepRequest)
        .then(step => {
            return prepareApiResponse(200, { step });
        })
        .catch(error => {
            return prepareApiResponse(400, { error })
        });

    await saveExecutionTimeMetric('UpdateRecipeStep', startTimeMS);

    return response;
}