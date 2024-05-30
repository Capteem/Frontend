import { configureStore, createSlice } from '@reduxjs/toolkit'

const sendReservation = createSlice({
	name : 'sendReservation',
	initialState : {
        fianlStudio : [""],
        finalPhotographer : [""],
        finalHair : [""],
        finalDate : '',
        finalStartDate : '',
        finalEndDate : '',
        finalHours : 0,
        finalDateShow : '',
        finalArea : "",
        finalSubarea: "",
    },
    reducers : {
        reset(state){
            state.fianlStudio = [""];
            state.finalPhotographer = [""];
            state.finalHair = [""];
            state.finalDate = '';
            state.finalStartDate = '';
            state.finalEndDate = '';
            state.finalHours = 0;
            state.finalDateShow = '';
            state.finalArea = "";
            state.finalSubarea = "";

        },
        changeStudio(state, action){
            state.fianlStudio = action.payload;
        },
        changePhotographer(state, action){
            state.finalPhotographer = action.payload;
        },
        changeHair(state, action){
            state.finalHair = action.payload;
        },
        changeDate(state, action){
            state.finalDate = action.payload;
        },
        changeFinalStartDate(state, action){
            state.finalStartDate = action.payload;
        },
        changeFinalEndDate(state, action){
            state.finalEndDate = action.payload;
        },
        changeFinalHours(state, action){
            state.finalHours = action.payload;
        },
        changeDateShow(state, action){
            state.finalDateShow = action.payload;
        },
        changeArea(state, action){
            state.finalArea = action.payload;
        },
        changeSubarea(state, action){
            state.finalSubarea = action.payload;
        },
    }
})

export const {reset, changeStudio, changePhotographer, changeHair, 
    changeDate, changeArea, changeSubarea, changeDateShow,
    changeFinalStartDate, changeFinalEndDate,changeFinalHours,
} = sendReservation.actions;

const includeDates = createSlice({
    name : 'includeDates',
	initialState : {
        includeDates : [],
    },
    reducers : {
        changeincludeDates(state, action){
            const addDate = action.payload;
            state.includeDates = [...state.includeDates, addDate];
        },
        initialDates(){

        }
    }
})

const includeTimes = createSlice({
    name : 'includeTimes',
	initialState : {
        includeTimes : [""],
    },
    reducers : {
        changeincludeTimes(state, action){
            state.includeTimes = action.payload;
        },
    }
})

export const {changeincludeTimes, showTimes} = includeTimes.actions;

//달력에서 날짜+시간 모두 선택 -> 포폴컴포넌트에서 시간 선택했는지 참고용
const includeDateList = createSlice({
    name : 'includeDateList',
    initialState : {
        includeDateList : [""],
    },
    reducers : {
        changeIncludeDateList(state, action){
            state.includeDateList = action.payload;
        }
    }
})
export const {changeIncludeDateList} = includeDateList.actions;

//포폴선택하면 교집합 시간들
const commonTimeList = createSlice({
    name : 'commonTimeList',
    initialState : {
        commonTimeList : [""],
    },
    reducers : {
        changeCommonTimeList(state, action){
            state.commonTimeList = action.payload;
        }
    }
})
export const {changeCommonTimeList} = commonTimeList.actions;

// const includeArea = createSlice({
//     name : 'includeArea',
// 	initialState : {
//         includeArea : [],
//         length: 0,
//     },
//     reducers : {
//         // changeincludeArea(state, action){
//         //     const areaToAdd = action.payload;
//         //     if (!state.includeArea.includes(areaToAdd) && areaToAdd !== "") {
//         //         state.includeArea = [...state.includeArea, areaToAdd];
//         //         state.length += 1;
//         //     }
//         // },
//         // deleteArea(state, action){
//         //     state.includeArea 
//         //     = state.includeArea.filter((element) => element !== action.payload);
//         // }
//     }
// })

// export const {changeincludeArea, deleteArea} = includeArea.actions;

// const includeSubArea = createSlice({
//     name : 'includeSubArea',
// 	initialState : {
//         includeSubArea : [""],
//     },
//     reducers : {

//     }
// })

export default configureStore({
	reducer: { 
        sendReservation : sendReservation.reducer,
        includeDates : includeDates.reducer,
        includeTimes : includeTimes.reducer,
        includeDateList : includeDateList.reducer,
        commonTimeList : commonTimeList.reducer,

        // includeArea : includeArea.reducer,
        // includeSubArea : includeSubArea.reducer,
    }
})