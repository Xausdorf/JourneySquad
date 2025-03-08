import {FC, useEffect, useState} from "react";
import {Page} from "@/components/Page.tsx";
import {useParams} from "react-router-dom";

import {TravelPlan} from "@/models/TravelPlan.ts";
import {fetchTravelPlan, updateTravelPlan} from "@/services/travelPlanService.ts";
import {NotFoundPage} from "@/pages/NotFound.tsx";
import {LoadingPage} from "@/pages/Loading.tsx";
import {TravelPlanTag, User} from "@/models/types.ts";
import {TravelPlanPhoto} from "@/models/TravelPlanPhoto.ts";
import {areSetsEqual, getIdSet} from "@/utils/Sets.ts";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {TravelPlanForm} from "@/components/TravelPlanForm/TravelPlanForm.tsx";

export const TravelPlanValidateEditPage : FC = () => {
    const params = useParams()
    const travelPlanId = params.id?.match(/\d+/) ?? null;

    if (!travelPlanId)
        return <NotFoundPage/>

    const [travelPlan, setTravelPlan] = useState<TravelPlan>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTravelPlan = async (id : number) => {
            try {
                const plan = await fetchTravelPlan(id);
                setTravelPlan(plan ?? undefined);
            } catch (err) {
                console.error('Ошибка при загрузке travel plans:', err);
                setError("Ошибка загрузки данных");
            } finally {
                setIsLoading(false);
            }
        };

        loadTravelPlan(Number(params.id))
    }, []);


    if (isLoading) {
        return <LoadingPage/>;
    }

    if (!travelPlan) {
        return <NotFoundPage/>
    }

    if (error) {
        return <Page><p>{error}</p></Page>;
    }

    return <TravelPlanEditPage editingTravelPlan={travelPlan}/>
}

type TravelPlanEditPageProps = {
    editingTravelPlan: TravelPlan
}

const TravelPlanEditPage : FC<TravelPlanEditPageProps> = ({editingTravelPlan}) => {
    const [travelPlan, setTravelPlan] = useState<TravelPlan>(editingTravelPlan)

    const handleSubmit = async (
        title: string,
        description: string,
        startDate: Date,
        endDate: Date,
        activeTags: TravelPlanTag[],
        photos: TravelPlanPhoto[],
        participants: User[],
    ) => {
        if (!travelPlan.id)
            throw error

        const updates: Partial<TravelPlan> = {};

        if (title !== travelPlan.title) updates.title = title;
        if (description !== travelPlan.description) updates.description = description;
        if (startDate !== travelPlan.startDate) updates.startDate = startDate;
        if (endDate !== travelPlan.endDate) updates.endDate = endDate;
        if (!areSetsEqual(getIdSet(activeTags), getIdSet(travelPlan.tags))) updates.tags = activeTags;
        if (!areSetsEqual(getIdSet(photos), getIdSet(travelPlan.photos))) updates.photos = photos;
        if (!areSetsEqual(getIdSet(participants), getIdSet(travelPlan.participants))) updates.participants = participants;

        if (Object.keys(updates).length === 0) {
            return;
        }

        try {
            await updateTravelPlan(travelPlan.id, updates)
        } catch (error) {
            console.error("Ошибка при сохранении travel plan:", error);
        }
    };

    return (
        <Page>
            <TravelPlanForm travelPlan={travelPlan} onSubmit={handleSubmit}/>
        </Page>
    )
}