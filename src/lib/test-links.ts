export const PRETEST_URL = "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=z4dofreEbkKwzb2Ho_eXfSApUuo6j21OoJR1Cgv3xZpUNTVNWFpLVVRRTVo5MFlJSTgyNzFJVjVMTSQlQCN0PWcu";
export const POSTTEST_URL = "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=z4dofreEbkKwzb2Ho_eXfSApUuo6j21OoJR1Cgv3xZpUREpROERCTVhETDlMSFVMRVE3VTdWSFBZSCQlQCN0PWcu";

// Sessions that require the test link to be opened before they can be completed
const TEST_LINK_URLS: Record<string, string> = {
    "session-1": PRETEST_URL,
    "session-7": POSTTEST_URL,
};

export function requiresTestLink(sessionName: string) {
    return sessionName in TEST_LINK_URLS;
}
