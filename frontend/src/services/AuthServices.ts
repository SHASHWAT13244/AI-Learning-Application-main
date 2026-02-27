import type {
    GetProfileResponseTypes,
    LoginApiTypes,
    LoginResponseTypes,
    SignUpResponseTypes,
    SignupApiTypes,
    UserTypes,
    PasswordChangeApiTypes,
    PasswordResponseTypes,
} from '../types';
import { API_PATHS } from '../utils/Apipath';
import axiosInstance from '../utils/axiosInstance';
import { handleAPIErrLogic } from './ReusableErrorServices';

const login = async ({
    email,
    password,
}: LoginApiTypes): Promise<LoginResponseTypes> => {
    try {
        const response = await axiosInstance.post<LoginResponseTypes>(
            API_PATHS.AUTH.LOGIN,
            {
                email,
                password,
            }
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const register = async ({
    username,
    email,
    password,
}: SignupApiTypes): Promise<SignUpResponseTypes> => {
    try {
        const response = await axiosInstance.post<SignUpResponseTypes>(
            API_PATHS.AUTH.REGISTER,
            { username, email, password }
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const getProfile = async (): Promise<GetProfileResponseTypes> => {
    try {
        const response = await axiosInstance.get<GetProfileResponseTypes>(
            API_PATHS.AUTH.GET_PROFILE
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const updateProfile = async (
    userData: UserTypes
): Promise<GetProfileResponseTypes> => {
    try {
        const response = await axiosInstance.put<GetProfileResponseTypes>(
            API_PATHS.AUTH.GET_PROFILE,
            userData
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const changePassword = async (
    passwords: PasswordChangeApiTypes
): Promise<PasswordResponseTypes> => {
    try {
        const response = await axiosInstance.post<PasswordResponseTypes>(
            API_PATHS.AUTH.CHANGE_PASSWORD,
            passwords
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const AuthServices = {
    login,
    register,
    getProfile,
    updateProfile,
    changePassword,
};

export default AuthServices;
