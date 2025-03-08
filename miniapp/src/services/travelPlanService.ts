import {createApiService} from './api/createApiService';

import {TravelPlan} from "@/models/TravelPlan.ts";
import {TravelPlanTag} from "@/models/types.ts";
import {TravelPlanQuery} from "@/services/api/TravelPlanQuery.ts";

const apiService = createApiService();

export async function fetchTravelPlans(query?: TravelPlanQuery): Promise<TravelPlan[]> {
    try {
        return await apiService.getTravelPlans(query);
    } catch (error) {
        console.error('Ошибка при загрузке travel plans:', error);
        throw error;
    }
}

export async function fetchTravelPlanTags(): Promise<TravelPlanTag[]> {
    try {
        return await apiService.getTravelPlanTags();
    } catch (error) {
        console.error('Ошибка при за tags:', error);
        throw error;
    }
}

export async function fetchTravelPlan(id: number): Promise<TravelPlan | null> {
    try {
        return await apiService.getTravelPlan(id);
    } catch (error) {
        console.error('Ошибка при загрузке travel plans:', error);
        throw error;
    }
}

export async function createTravelPlan(travelPlan: TravelPlan) {
    try {
        return await apiService.createTravelPlan(travelPlan);
    } catch (error) {
        console.error('Ошибка при создании travel plan:', error);
        throw error;
    }
}

export async function updateTravelPlan(id: number, updates: Partial<TravelPlan>) {
    try {
        return await apiService.updateTravelPlan(id, updates);
    } catch (error) {
        console.error('Ошибка при обновлении travel plan:', error);
        throw error;
    }
}