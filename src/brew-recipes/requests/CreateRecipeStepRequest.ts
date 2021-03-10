export interface CreateRecipeStepRequest {
    recipeId: string;
    position: number;
    instructions: string;
    durationInMS: number;
}