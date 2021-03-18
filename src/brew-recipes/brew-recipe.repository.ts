import { BrewRecipeService } from "./brew-recipe.service";
import { BrewRecipeItem } from "./models/BrewRecipeItem";
import { CreateBrewRecipeRequest } from "./requests/CreateBrewRecipeRequest";
import { UpdateBrewRecipeRequest } from "./requests/UpdateBrewRecipeRequest";

export class BrewRecipeRepository {
    private readonly brewRecipeService: BrewRecipeService;

    constructor() {
        this.brewRecipeService = new BrewRecipeService();
    }

    async getAllBrewRecipesByUserId(userId: string): Promise<BrewRecipeItem[]> {
        return await this.brewRecipeService.getAllBrewRecipesByUserId(userId);
    }

    async createBrewRecipe(userId: string, createBrewRecipeRequest: CreateBrewRecipeRequest): Promise<BrewRecipeItem> {
        return await this.brewRecipeService.createBrewRecipe(userId, createBrewRecipeRequest);
    }

    async updateBrewRecipe(userId: string, recipeId: string, updateBrewRecipeRequest: UpdateBrewRecipeRequest): Promise<BrewRecipeItem> {
        return await this.brewRecipeService.updateBrewRecipe(userId, recipeId, updateBrewRecipeRequest);
    }

    async deleteBrewRecipeById(userId: string, recipeId: string): Promise<BrewRecipeItem> {
        return await this.brewRecipeService.deleteBrewRecipeById(userId, recipeId);
    }
}