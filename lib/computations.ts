type TotalExpComputationProps = {
  currentExp: number;
  currentTotalExp: number;
  earnedExp: number;
  level: number;
};

type ComputedCredPoints = {
  completedQuestCount: number;
  credibilityPoints: number;
};

export const totalExpComputation = ({
  currentExp,
  currentTotalExp,
  earnedExp,
  level,
}: TotalExpComputationProps) => {
  const totalExp = currentTotalExp + earnedExp;
  currentExp += earnedExp;

  while (currentExp >= 100 * level ** 2) {
    currentExp -= 100 * level ** 2;
    level += 1;
  }

  return {
    totalExp,
    currentTotalExp,
    currentExp,
    earnedExp,
    level,
  };
};

export const computedCredPoints = ({
  completedQuestCount,
  credibilityPoints,
}: ComputedCredPoints) => {
  return completedQuestCount && completedQuestCount > 0
      ? Math.round((credibilityPoints / completedQuestCount) * 100)
      : 0;
};
