import {AxiosClient} from "./AxiosClient";
import {ApiResModel} from "../models/ApiResModel";
import {injectable} from "inversify";
import {T_LoginVO, T_QueryVO} from "../models/UserModel";

@injectable()
export class ApiService {
    init(): Promise<ApiResModel> {
        return AxiosClient.get("init-web")
    }

    tracking(): Promise<ApiResModel> {
        return AxiosClient.get("tracking-web")
    }

    login(data: T_LoginVO): Promise<ApiResModel> {
        return AxiosClient.post("auth/login", data);
    }

    logout(): Promise<ApiResModel> {
        return AxiosClient.post("account/logout");
    }

    getMe(): Promise<ApiResModel> {
        return AxiosClient.get("account/me")
    }
    getListTask(_query?: T_QueryVO): Promise<ApiResModel> {
        return AxiosClient.get("task",{
            sort: "asc",
            sort_by: "started_at"
        })
    }
    postAddTask(data:any): Promise<ApiResModel> {
        return AxiosClient.post("task/create",data)
    }
    postEditTask(id:string|undefined,data:any): Promise<ApiResModel> {
        return AxiosClient.post(`task/edit/${id}`,data)
    }
   AddMiniTask(data:any): Promise<ApiResModel> {
        return AxiosClient.post(`mini/create`,data)
    }
    getStatistical(): Promise<ApiResModel> {
        return AxiosClient.get(`task/statistical/all`)
    }
}
