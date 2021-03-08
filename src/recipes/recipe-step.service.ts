import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';
import { DeleteItemInput, DocumentClient, PutItemInput, QueryInput, UpdateItemInput } from 'aws-sdk/clients/dynamodb';
import { v4 as uuid } from 'uuid';
import { createLogger } from '../utils/logger';
import { RecipeStepItem } from './models/RecipeStepItem';
import { CreateRecipeStepRequest } from './requests/CreateRecipeStepRequest';
import { UpdateRecipeStepRequest } from './requests/UpdateRecipeStepRequest';

export class RecipeStepService {

    private readonly docClient: DocumentClient;
    private readonly s3Client: S3;
    private readonly recipeStepTbl;
    private readonly rawImagesBucketName;
    private readonly thumbnailsBucketName;
    private readonly urlExpiration;
    private readonly logger;

    constructor() {
        this.docClient = new AWS.DynamoDB.DocumentClient();
        this.s3Client = new AWS.S3({ signatureVersion: 'v4' });
        this.recipeStepTbl = process.env.RECIPE_STEPS_TABLE;
        this.rawImagesBucketName = process.env.RECIPE_STEP_RAW_IMAGES_BUCKET;
        this.thumbnailsBucketName = process.env.RECIPE_STEP_THUMBNAILS_BUCKET;
        this.urlExpiration = process.env.SIGNED_URL_EXPIRATION;
        this.logger = createLogger('RecipeStepService');
    }

    /**
     * Retrieves all recipes steps for a brew recipe
     * @param recipeId Id of recipe steps belong to
     * @returns Promise containing array of all recipe steps for provided recipe id
     */
    async getAllRecipeStepsByRecipeId(recipeId: string): Promise<RecipeStepItem[]> {
        this.logger.info(`Getting all recipe steps for recipe id ${recipeId}`);
        if (!recipeId) {
            throw new Error(`No recipe id provided while getting recipe steps`);
        }

        const params: QueryInput = {
            TableName: this.recipeStepTbl,
            KeyConditionExpression: 'recipeId = :recipeId',
            ExpressionAttributeValues: {
                ':recipeId': { S: recipeId }
            },
            ScanIndexForward: false
        };

        return await this.docClient.query(params)
            .promise()
            .then(data => {
                return data.Items as RecipeStepItem[];
            }, err => {
                this.logger.error(`Error getting all recipe steps for recipe id ${recipeId}: ${err}`);
                throw new Error(`Error while attempting to get all recipe steps for recipe id ${recipeId}`);
            });
    }

    /**
     * Create a Recipe Step for a Brew Recipe
     * @param createRecipeStepRequest Recipe Step Attributes
     * @returns Promise containing created recipe step
     */
    async createRecipeStep(createRecipeStepRequest: CreateRecipeStepRequest): Promise<RecipeStepItem> {
        this.logger.info(`Creating new recipe step for recipe id ${createRecipeStepRequest.recipeId}`);

        const newRecipeStepItem: RecipeStepItem = {
            stepId: uuid(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...createRecipeStepRequest
        };

        const params: PutItemInput = {
            TableName: this.recipeStepTbl,
            Item: {
                recipeId: { S: newRecipeStepItem.recipeId },
                position: { N: newRecipeStepItem.position.toString() },
                stepId: { S: newRecipeStepItem.stepId },
                createdAt: { S: newRecipeStepItem.createdAt },
                updatedAt: { S: newRecipeStepItem.updatedAt },
                instructions: { S: newRecipeStepItem.instructions },
                durationInMS: { N: newRecipeStepItem.durationInMS.toString() },
            }
        };

        return await this.docClient.put(params)
            .promise()
            .then(() => newRecipeStepItem, err => {
                this.logger.error(`Error creating new recipe step for recipe id ${createRecipeStepRequest.recipeId}: ${err}`);
                throw new Error(`Error creating new recipe step`);
            });

    }

    /**
     * Update a recipe step
     * @param recipeId Id of recipe the step belongs to
     * @param stepId Id of step being updated
     * @param updateRecipeStepRequest Attributes being updated
     * @returns Promise containing the updated recipe step
     */
    async updateRecipeStep(recipeId: string, stepId: string, updateRecipeStepRequest: UpdateRecipeStepRequest): Promise<RecipeStepItem> {
        this.logger.info(`Updating recipe step for id ${stepId}`);
        if (!recipeId) {
            throw new Error('Cannot update recipe step due to missing recipe id');
        }

        if (!stepId) {
            throw new Error('Cannot update recipe step due to missing step id');
        }

        // Reject empty update request
        if (Object.keys(updateRecipeStepRequest).length === 0) {
            throw new Error('Empty update request');
        }

        let UpdateExpression = 'set updatedAt = :updatedAt';
        const ExpressionAttributeValues = {
            ':updatedAt': { S: new Date().toISOString() }
        };
        if (updateRecipeStepRequest.instructions) {
            UpdateExpression += ', instructions = :instructions';
            ExpressionAttributeValues['instructions'] = updateRecipeStepRequest.instructions;
        }

        if (updateRecipeStepRequest.durationInMS) {
            UpdateExpression += ', durationInMS = :durationInMS';
            ExpressionAttributeValues['durationInMS'] = updateRecipeStepRequest.durationInMS;
        }

        const params: UpdateItemInput = {
            TableName: this.recipeStepTbl,
            Key: {
                'recipeId': { S: recipeId },
                'stepId': { S: stepId }
            },
            UpdateExpression,
            ExpressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        };

        return await this.docClient.update(params)
            .promise()
            .then(data => {
                return data.$response.data as RecipeStepItem;
            }, err => {
                this.logger.error(`Error during update operation: ${err}`);
                throw new Error(`Error updating recipe step id ${stepId}: ${err}`);
            });
    }

    async deleteRecipeStepById(recipeId: string, stepId: string): Promise<RecipeStepItem> {
        this.logger.info(`Delete recipe step for id ${stepId}`);

        const params: DeleteItemInput = {
            TableName: this.recipeStepTbl,
            Key: {
                'recipeId': { S: recipeId },
                'stepId': { S: stepId }
            },
            ReturnValues: 'ALL_OLD'
        };

        return await this.docClient.delete(params)
            .promise()
            .then(data => {
                return data.$response.data as RecipeStepItem;
            }, err => {
                this.logger.error(`Error occurred while attempting to delete recipe step for step id ${stepId}: ${err}`);
                throw new Error('Error occurred during delete operation');
            });
    }
}