import {FC, useState, useEffect} from "react";

import {Page} from "@/components/Page.tsx";
import {fetchTravelPlans} from "@/services/travelPlanService.ts";
import {TravelPlanCardHorizontal} from "@/components/TravelPlanCard/TravelPlanCard.tsx";
import {TravelPlan} from "@/models/TravelPlan.ts";

export const TravelPlanListPage : FC = () => {
    const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTravelPlans = async () => {
            try {
                const plans = await fetchTravelPlans();
                setTravelPlans(plans);
            } catch (err) {
                console.error('Ошибка при загрузке travel plans:', err);
                setError("Ошибка загрузки данных");
            } finally {
                setIsLoading(false);
            }
        };

        loadTravelPlans();
    }, []);

    if (isLoading) {
        return <Page><p>Загрузка...</p></Page>;
    }

    if (error) {
        return <Page><p>{error}</p></Page>;
    }

    return (
        <Page>
            <h1>Travel Plan List</h1>
            <div>
                {
                    travelPlans.map(
                        (travelPlan) =>
                            <TravelPlanCardHorizontal key={travelPlan.id} travelPlan={travelPlan}/>
                    )
                }
            </div>
        </Page>
    )
}