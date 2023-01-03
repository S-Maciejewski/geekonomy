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

    static async getHighscores() {
        return ApiClient.getHighscores()
    }

    static async handleHighscore(name: string) {
        await ApiClient.postHighscore(name)
    }
}
