const toMs = (t: number | string | Date) => new Date(t).getTime();

type timestamps = {
  previousTimeStamp: number | string | Date;
  currentTimeStamp: number | string | Date;
};

export const validateTimeStamp = ({ previousTimeStamp, currentTimeStamp }: timestamps) => {
  const prev = toMs(previousTimeStamp);
  const curr = toMs(currentTimeStamp);
  return Number.isFinite(prev) && Number.isFinite(curr) && curr > prev && curr <= Date.now() + 5000;
};