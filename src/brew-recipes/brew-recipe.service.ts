import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { v4 as uuid } from 'uuid';
import winston from 'winston';
import { createLogger } from '../utils/logger';
import { BrewRecipeItem } from './models/BrewRecipeItem';
import { CreateBrewRecipeRequest } from './requests/CreateBrewRecipeRequest';
import { UpdateBrewRecipeRequest } from './requests/UpdateBrewRecipeRequest';

export class BrewRecipeService {
    private readonly docClient: DocumentClient;
    private readonly brewRecipeTbl: string;
    private readonly logger: winston.Logger;
    
    constructor () {
        this.docClient = new AWS.DynamoDB.DocumentClient();
        this.brewRecipeTbl = process.env.BREW_RECIPES_TABLE;
        this.logger = createLogger('BrewRecipeService');
    }

    /**
     * Retrieve all Brew Recipes for a specific User
     * @param userId Id of User to retrieve Recipes for
     * @returns Promise caontaining Array of Brew Recipe Items
     */
    async getAllBrewRecipesByUserId(userId: string): Promise<BrewRecipeItem[]> {
        this.logger.info(`Getting all Brew Recipes for user Id ${userId}`);
        if (!userId) {
            this.logger.error(`Missing user Id during recipe get action`);
            throw new Error(`Missing user Id`);
        }

        const params = {
            TableName: this.brewRecipeTbl,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        };

        return await this.docClient.query(params)
            .promise()
            .then(data => {
                return data.Items as BrewRecipeItem[];
            }, err => {
                this.logger.error(`Error getting brew recipes for user Id ${userId}: ${err}`);
                throw new Error(`Error getting brew recipes`);
            });
    }

    /**
     * Save a new brew recipe for a user
     * @param userId Id of user the recipe belongs to
     * @param createBrewRecipeRequest Recipe details
     * @returns Created brew recipe
     */
    async createBrewRecipe(userId: string, createBrewRecipeRequest: CreateBrewRecipeRequest): Promise<BrewRecipeItem> {
        this.logger.info(`Creating Brew Recipe for User Id ${userId}`);

        const { title } = createBrewRecipeRequest;
        const recipeId = uuid();
        const createdAt = new Date().toISOString();
        const updatedAt = new Date().toISOString();

        const newBrewRecipeItem: BrewRecipeItem = {
            userId,
            recipeId,
            createdAt,
            updatedAt,
            title
        };

        const params = {
            TableName: this.brewRecipeTbl,
            Item: {
                ...newBrewRecipeItem
            }
        };

        return await this.docClient.put(params)
            .promise()
            .then(() => {
                return newBrewRecipeItem;
            }, err => {
                this.logger.error(`Error creating new brew recipe from request: ${createBrewRecipeRequest}, error: ${err}`);
                throw new Error(`Error creating new brew recipe`);
            });
    }

    /**
     * Updates a brew recipe
     * @param userId Id of user recipe belongs to
     * @param recipeId Id of recipe being updated
     * @param updateBrewRecipeRequest Attributes to be updated
     * @returns Updated Brew Recipe Item
     */
    async updateBrewRecipe(userId: string, recipeId: string, updateBrewRecipeRequest: UpdateBrewRecipeRequest): Promise<BrewRecipeItem> {
        if (!recipeId) {
            throw new Error('Cannot update brew recipe, missing recipe Id');
        }
        
        const { title } = updateBrewRecipeRequest;
        this.logger.info(`Updating brew recipe for recipe id ${recipeId}`);        

        const params = {
            TableName: this.brewRecipeTbl,
            Key: {
                'userId': userId,
                'recipeId': recipeId
            },
            UpdateExpression: 'set title = :title, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':title': title,
                ':updatedAt': new Date().toISOString()
            },
            ReturnValues: 'ALL_NEW'
        };

        return await this.docClient.update(params)
            .promise()
            .then(data => {
                if (data.$response.data) {
                    return data.$response.data.Attributes as BrewRecipeItem;
                }                
            }, err => {
                this.logger.error(`Error occurred during update operation: ${err}`);
                throw new Error(`Error updating recipe id ${recipeId}: ${err}`);
            });
    }

    /**
     * Deletes a single recipe
     * @param userId Id of user recipe belongs to
     * @param recipeId Id of recipe to delete
     * @returns Brew recipe that was deleted
     */
    async deleteBrewRecipeById(userId: string, recipeId: string): Promise<BrewRecipeItem> {
        this.logger.info(`Deleting brew recipe for recipe id ${recipeId}`);

        const params = {
            TableName: this.brewRecipeTbl,
            Key: {
                'userId': userId,
                'recipeId': recipeId
            },
            ReturnValues: 'ALL_OLD'
        };

        return await this.docClient.delete(params)
            .promise()
            .then(data => {
                if (data.$response.data) {
                    return data.$response.data.Attributes as BrewRecipeItem;
                }                
            }, err => {
                this.logger.error(`Error occurred while attempting to delete recipe id ${recipeId}: ${err}`);
                throw new Error('Error occurred during delete operation');
            });
    }

}