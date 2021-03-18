import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { prepareApiResponse } from "../../../utils/api";
import { saveExecutionTimeMetric } from "../../../utils/metrics";
import { RecipeStepRepository } from "../../recipe-step.repository";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startTimeMS = new Date().getTime();
    const recipeId = event.pathParameters.recipeId;
    const stepId = event.pathParameters.stepId;

    const recipeStepRepository = new RecipeStepRepository();
    const response = await recipeStepRepository.deleteRecipeStepById(recipeId, stepId)
        .then(step => {
            return prepareApiResponse(200, { step });
        })
        .catch(error => {
            return prepareApiResponse(400, { error })
        });

    await saveExecutionTimeMetric('DeleteRecipeStep', startTimeMS);

    return response;
}