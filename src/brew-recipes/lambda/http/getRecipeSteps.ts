import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { prepareApiResponse } from "../../../utils/api";
import { saveExecutionTimeMetric } from "../../../utils/metrics";
import { RecipeStepRepository } from "../../recipe-step.repository";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startTimeMS = new Date().getTime();
    const recipeId = event.pathParameters.recipeId;
    const recipeStepRepository = new RecipeStepRepository();

    const response = await recipeStepRepository.getAllRecipeStepsByRecipeId(recipeId)
        .then(steps => {
            return prepareApiResponse(200, { recipeId, steps });
        })
        .catch(error => {
            return prepareApiResponse(400, { error })
        });

    await saveExecutionTimeMetric('GetRecipeSteps', startTimeMS);

    return response;
}