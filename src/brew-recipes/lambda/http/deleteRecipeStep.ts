import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { prepareApiResponse } from "../../../utils/api";
import { saveExecutionTimeMetric } from "../../../utils/metrics";
import { RecipeStepRepository } from "../../recipe-step.repository";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startTimeMS = new Date().getTime();
    const recipeId = event.pathParameters.recipeId;
    const stepId = event.pathParameters.stepId;

    const recipeStepRepository = new RecipeStepRepository();
    const step = await recipeStepRepository.deleteRecipeStepById(recipeId, stepId);

    await saveExecutionTimeMetric('DeleteRecipeStep', startTimeMS);

    return prepareApiResponse(200, { step });
}