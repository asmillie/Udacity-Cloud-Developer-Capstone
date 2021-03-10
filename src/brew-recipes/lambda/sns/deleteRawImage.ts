import { S3Event, SNSEvent, SNSHandler } from "aws-lambda";
import { saveExecutionTimeMetric } from "../../../utils/metrics";
import { RecipeStepRepository } from "../../recipe-step.repository";

export const handler: SNSHandler = async (event: SNSEvent) => {
    const startTimeInMS = new Date().getTime();
    const recipeStepRepository = new RecipeStepRepository();
    for (const record of event.Records) {
        const s3Event: S3Event = JSON.parse(record.Sns.Message);
        for (const eventRecord of s3Event.Records) {
            const stepId = eventRecord.s3.object.key;
            await recipeStepRepository.deleteRawImage(stepId);
        }
    }

    await saveExecutionTimeMetric('DeleteImage', startTimeInMS);
}