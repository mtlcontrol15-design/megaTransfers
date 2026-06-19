import React from "react";
import { FlatList, Text, View } from "react-native";
import JobCard from "../JobCard/JobCard";

const monthMap = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

const parseJobDate = (job) => {
  if (job?.createdAt) {
    return new Date(job.createdAt);
  }
  if (job?.bookingDate && job?.bookingTime) {
    const [day, monthStr, year] = job.bookingDate.split(" ");
    const [hour, minute] = job.bookingTime.split(":");

    return new Date(
      Number(year),
      monthMap[monthStr],
      Number(day),
      Number(hour),
      Number(minute)
    );
  }
  return new Date(0);
};
const JobItem = ({ item, colors, onPressStatus, navigation, isUpdatingJob }) => {
  return (
    <JobCard
      job={item}
      colors={colors}
      isUpdatingJob={isUpdatingJob}
      onPressStatus={() => onPressStatus(item)}
      onPress={() => navigation.navigate("JobDetails", { job: item, jobId: item?._id })}
    />
  );
};
export default JobItem;