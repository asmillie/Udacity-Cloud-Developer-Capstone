import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { prepareApiResponse } from '../../../utils/api';
import { saveExecutionTimeMetric } from '../../../utils/metrics';
import { RecipeStepRepository } from '../../recipe-step.repository';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const startTimeMS = new Date().getTime();
  const stepId = event.pathParameters.stepId;

  const recipeStepRepository = new RecipeStepRepository();
  const signedUrl = recipeStepRepository.getUploadUrl(stepId);

  await saveExecutionTimeMetric('GenerateUploadURL',startTimeMS);
  return prepareApiResponse(200, { uploadUrl: signedUrl });
}
