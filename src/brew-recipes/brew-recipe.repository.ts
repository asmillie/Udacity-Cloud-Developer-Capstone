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
        return await this.createBrewRecipe(userId, createBrewRecipeRequest);
    }

    async updateBrewRecipe(userId: string, updateBrewRecipeRequest: UpdateBrewRecipeRequest): Promise<BrewRecipeItem> {
        return await this.updateBrewRecipe(userId, updateBrewRecipeRequest);
    }

    async deleteBrewRecipeById(userId: string, recipeId: string): Promise<BrewRecipeItem> {
        return await this.deleteBrewRecipeById(userId, recipeId);
    }
}