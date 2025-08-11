export const CONSTANT = {
    OWNER_ROLE_ID: "role_aJmP1Hwxt1fnIIC5",
    LEAD_ROLE_ID: "role_aJmP1Hwxt1fnIIC5",
    DEVELOPER_ROLE_ID: "role_aJmP1Hwxt1fnIIC5",

    ADMIN_PERMISSION: "perm_aJmPbhtjd_zfO3O0",
    TEAM_WRITE_PERMISSION:"perm_aJmPiHwxt1fnIIBN",
    TEAM_READ_PERMISSION:"perm_aJmPr3wxt1fnIICQ",
    TEAM_DELETE_PERMISSION:"perm_aJmPuAAoUgTShSP4",
};

export const ROLE_NAME_MAP = {
    [CONSTANT.OWNER_ROLE_ID]: "Owner",
    [CONSTANT.LEAD_ROLE_ID]: "Lead",
    [CONSTANT.DEVELOPER_ROLE_ID]: "Developer",
};

export const Permission_NAME_MAP = {
    [CONSTANT.ADMIN_PERMISSION]: "Owner",
    [CONSTANT.TEAM_WRITE_PERMISSION]: "Lead",
    [CONSTANT.TEAM_READ_PERMISSION]: "Developer",
    [CONSTANT.TEAM_DELETE_PERMISSION]: "Developer",
};