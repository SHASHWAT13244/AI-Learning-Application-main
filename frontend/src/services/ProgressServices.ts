import type { DashBoardPayloadTypes } from '../types';
import { API_PATHS } from '../utils/Apipath';
import axiosInstance from '../utils/axiosInstance';
import { handleAPIErrLogic } from './ReusableErrorServices';

const getDashBoardData = async (): Promise<DashBoardPayloadTypes> => {
    try {
        const response = await axiosInstance.get<DashBoardPayloadTypes>(
            API_PATHS.PROGRESS.GET_DASHBOARD
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const ProgressServices = {
    getDashBoardData,
};
export default ProgressServices;
