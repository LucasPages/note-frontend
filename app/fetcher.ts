import wretch, { Wretch, WretchError } from "wretch";
import { AuthActions } from "./auth/utils";

const { handleJWTRefresh, storeToken, getToken } = AuthActions();

const api = () => {
    return (
        wretch("http://localhost:8000")
            .auth(`Bearer ${getToken("access")}`)
            .catcher(401, async (error: WretchError, request: Wretch) => {
                try {
                    const { access } = (await handleJWTRefresh().json()) as {
                        access: string;
                    };

                    storeToken(access, "access");

                    return request
                        .auth(`Bearer ${access}`)
                        .fetch()
                        .unauthorized(() => {
                            window.location.replace("/");
                        })
                        .json();
                } catch (err) {
                    window.location.replace("/");
                }
            })
    );
};

export const fetcher = (url: string): Promise<any> => {
    return api().get(url).json();
};