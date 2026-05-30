import { Job } from "./jobsModels";

export type List = {
    id: number; // 123
    name: string;
    jobs: Job[];
}