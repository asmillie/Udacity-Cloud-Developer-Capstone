export interface RecipeStepItem {
    recipeId: string;
    position: number;
    stepId: string;
    createdAt: string;
    updatedAt: string;
    instructions: string;
    durationInMS: number;
    thumbnailUrl?: string;
}