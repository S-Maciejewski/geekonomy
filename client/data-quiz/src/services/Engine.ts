import {ApiClient} from "./ApiClient";
import {store} from "../store/store";


export class Engine {

    static async getGameState() {
        await ApiClient.getQuizGameState()
    }

    static async handleAnswer(answer: string) {
        await ApiClient.postQuizAnswer(answer)
        store.getState()
    }
}