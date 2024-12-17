import React from "react";
import Main from "@/components/Main";
//============server side setting(s)
// import wrapper from "@/store/configureStore";
// import { parse } from "cookie";
// import { CHECK_AUTH } from "@/actions/auth";
// import axios from "axios";
// import { END } from "redux-saga";
// import { ssrApi } from "@/func/api";
//============server side setting(e)

export default function HomePage() {
    return <Main title="대진프로그램" />;
}

// export const getServerSideProps = wrapper.getServerSideProps(
//     async (context) => {
//         const cookie = context.req ? context.req.headers.cookie : "";
//         if (cookie) {
//             const parsedCookies = parse(cookie);
//             const authCookie = parsedCookies["qualityAuthToken"];

//             axios.defaults.headers.Cookie = "";
//             if (context.req && cookie) {
//                 axios.defaults.headers.Cookie = cookie;
//             }

//             await ssrApi(context, CHECK_AUTH, authCookie ? true : false);
//         }

//         context.store.dispatch(END);
//         await context.store.sagaTask.toPromise();
//     }
// );
