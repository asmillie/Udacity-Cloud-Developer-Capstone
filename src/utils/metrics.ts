import * as AWS from 'aws-sdk';
import { PutMetricDataInput } from 'aws-sdk/clients/cloudwatch';
import { createLogger } from './logger';

AWS.config.update({ region: process.env.REGION });
const cw = new AWS.CloudWatch({ apiVersion: '2010-08-01' });
const Namespace = process.env.METRIC_NAMESPACE;

const logger = createLogger('MetricsUtil');

export async function saveExecutionTimeMetric(serviceName: string, startTimeMS: number) {
    const endTimeMS = new Date().getTime();
    const timeTakenInMS = endTimeMS - startTimeMS;
  
    const params: PutMetricDataInput = {
      MetricData: [
        {
          MetricName: 'ExecutionTimeInMS',
          Dimensions: [
            {
                Name: 'ServiceName',
                Value: serviceName
            }
          ],
          Unit: 'Milliseconds',
          Value: timeTakenInMS
        }
      ],
      Namespace
    };

    await cw.putMetricData(params).promise().catch(err => {
        logger.error(`Error logging execution time metric: ${err}`);        
    });
  }