/** Блок count + percentage (как в ответе API портрета клиента) */
export type ClientPortraitCountPercentage = {
  count: number;
  percentage: number;
};

export type ClientPortraitGeneralByGender = {
  man: ClientPortraitCountPercentage;
  woman: ClientPortraitCountPercentage;
  not_defined: ClientPortraitCountPercentage;
};

export type ClientPortraitGeneralByAge = {
  under_25: ClientPortraitCountPercentage;
  '25_to_40': ClientPortraitCountPercentage;
  '40_to_55': ClientPortraitCountPercentage;
  over_55: ClientPortraitCountPercentage;
  not_defined: ClientPortraitCountPercentage;
};

export type ClientPortraitGeneralBySegment = {
  newbie: ClientPortraitCountPercentage;
  active: ClientPortraitCountPercentage;
  inactive: ClientPortraitCountPercentage;
  not_defined: ClientPortraitCountPercentage;
};

export type ClientPortraitGeneralStats = {
  total_calls: number;
  by_gender: ClientPortraitGeneralByGender;
  by_age: ClientPortraitGeneralByAge;
  by_segment: ClientPortraitGeneralBySegment;
};

export type ClientPortraitDealProbability = {
  high: ClientPortraitCountPercentage;
  medium: ClientPortraitCountPercentage;
  low: ClientPortraitCountPercentage;
  not_defined: ClientPortraitCountPercentage;
};

export type ClientPortraitNextContactCategory = {
  meeting: ClientPortraitCountPercentage;
  call_or_messenger: ClientPortraitCountPercentage;
  not_defined: ClientPortraitCountPercentage;
};

export type ClientPortraitProblemResolutionStatus = {
  resolved: ClientPortraitCountPercentage;
  partially_resolved: ClientPortraitCountPercentage;
  not_resolved: ClientPortraitCountPercentage;
  not_defined: ClientPortraitCountPercentage;
};

export type ClientPortraitClientSegmentBlock = {
  newbie: ClientPortraitCountPercentage;
  active: ClientPortraitCountPercentage;
  inactive: ClientPortraitCountPercentage;
  not_defined: ClientPortraitCountPercentage;
};

export type ClientPortraitGenderStatSide = {
  total_calls: number;
  risk_of_losing_client: ClientPortraitCountPercentage;
  deal_probability: ClientPortraitDealProbability;
  next_contact_category: ClientPortraitNextContactCategory;
  problem_resolution_status: ClientPortraitProblemResolutionStatus;
  client_segment: ClientPortraitClientSegmentBlock;
};

export type ClientPortraitGenderStat = {
  man: ClientPortraitGenderStatSide;
  woman: ClientPortraitGenderStatSide;
};

export type ClientPortraitMaritalStatus = {
  married: ClientPortraitCountPercentage;
  divorced: ClientPortraitCountPercentage;
  widow: ClientPortraitCountPercentage;
  not_defined: ClientPortraitCountPercentage;
};

export type ClientPortraitRiskYesNo = {
  yes: ClientPortraitCountPercentage;
  no: ClientPortraitCountPercentage;
  not_defined: ClientPortraitCountPercentage;
};

export type ClientPortraitGenderDetailAgeBucket = {
  count: number;
  percentage: number;
  marital_status: ClientPortraitMaritalStatus;
  risk_of_losing_client: ClientPortraitRiskYesNo;
};

export type ClientPortraitGenderDetailByAge = {
  under_25: ClientPortraitGenderDetailAgeBucket;
  '25_to_40': ClientPortraitGenderDetailAgeBucket;
  '40_to_55': ClientPortraitGenderDetailAgeBucket;
  over_55: ClientPortraitGenderDetailAgeBucket;
  not_defined: ClientPortraitGenderDetailAgeBucket;
};

export type ClientPortraitGenderDetailStat = {
  man: ClientPortraitGenderDetailByAge;
  woman: ClientPortraitGenderDetailByAge;
};

export type ClientPortrait = {
  general_stats: ClientPortraitGeneralStats;
  gender_stat: ClientPortraitGenderStat;
  gender_detail_stat: ClientPortraitGenderDetailStat;
};
