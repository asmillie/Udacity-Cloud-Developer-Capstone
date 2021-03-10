import { RecipeStepItem } from "./models/RecipeStepItem";
import { RecipeStepService } from "./recipe-step.service";
import { CreateRecipeStepRequest } from "./requests/CreateRecipeStepRequest";
import { UpdateRecipeStepRequest } from "./requests/UpdateRecipeStepRequest";

export class RecipeStepRepository {
    private readonly recipeStepService: RecipeStepService;
    
    constructor() {
        this.recipeStepService = new RecipeStepService();
    }

    async getAllRecipeStepsByRecipeId(recipeId: string): Promise<RecipeStepItem[]> {
        return await this.recipeStepService.getAllRecipeStepsByRecipeId(recipeId);
    }

    async createRecipeStep(recipeId: string, createRecipeStepRequest: CreateRecipeStepRequest): Promise<RecipeStepItem> {
        return await this.createRecipeStep(recipeId, createRecipeStepRequest);
    }

    async updateRecipeStep(recipeId: string, stepId: string, updateRecipeStepRequest: UpdateRecipeStepRequest): Promise<RecipeStepItem> {
        return await this.recipeStepService.updateRecipeStep(recipeId, stepId, updateRecipeStepRequest);
    }

    async deleteRecipeStepById(recipeId: string, stepId: string): Promise<RecipeStepItem> {
        return await this.recipeStepService.deleteRecipeStepById(recipeId, stepId);
    }

    async saveThumbnailUrl(recipeId: string, stepId: string): Promise<void> {
        return await this.recipeStepService.saveThumbnailUrl(recipeId, stepId);
    }

    getUploadUrl(stepId: string): string {
        return this.recipeStepService.getUploadUrl(stepId);
    }

    async saveThumbnail(image: Buffer, key: string): Promise<void> {
        return await this.recipeStepService.saveThumbnail(image, key);
    }

    async getRawImage(key: string): Promise<Buffer> {
        return await this.recipeStepService.getRawImage(key);
    }

    async deleteRawImage(key: string): Promise<void> {
        return await this.deleteRawImage(key);
    }
}