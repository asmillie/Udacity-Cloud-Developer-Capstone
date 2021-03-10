export interface UpdateRecipeStepRequest {
    recipeId: string;
    instructions?: string;
    durationInMS?: number;
}