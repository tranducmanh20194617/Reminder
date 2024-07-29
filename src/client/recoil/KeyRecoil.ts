import {Utils} from "../core/Utils";
import {v4 as uuid} from "uuid";
import {StatisticalModel} from "../models/ReminderModel";

const createKey = (key: string) => {
    if (Utils.isDev()) {
        return `${key}-${uuid()}`
    }

    return key
}

// Init Tracking
export const KeyIT = createKey("it")

// Config
export const KeyTheme = createKey("theme")

// Account
export const KeyMe = createKey("me")

// User Login History
export const KeyLoginHistory = createKey('UserLoginHistory')

export const KeyActivityLog = createKey('UserActivityLog')

export const KeyLanguage = createKey('language')

export const KeyDiaryList = createKey('diaryList')

export const KeyDiaryListPost = createKey('diaryListPost')

export const KeyTaskList =createKey('TaskList')

export const KeyStatistical =createKey('Statistical')