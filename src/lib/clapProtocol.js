export function getClapMessage(completedCount) {
  switch (completedCount) {
    case 1:
      return "👏 One clap. Respectable.";
    case 2:
      return "👏👏 Two claps. Okayyy, someone's cooking.";
    case 3:
      return "👏👏👏 THREE CLAPS. You know the protocol.";
    default:
      return null;
  }
}

export function getClapEmoji(completedCount) {
  return "👏".repeat(completedCount);
}

export function getCookedStatus(completedCount) {
  switch (completedCount) {
    case 0:
      return "We're cooked.";
    case 1:
      return "Still alive.";
    case 2:
      return "Actually productive today.";
    case 3:
      return "Who are you and what have you done with yourself?";
    default:
      return "";
  }
}

export function getComboLabel(completedCount) {
  if (completedCount === 3) return "TRIPLE COMBO";
  if (completedCount === 2) return "DOUBLE COMBO";
  return null;
}

export function getHeroCopy(completedCount) {
  switch (completedCount) {
    case 1:
      return {
        title: "ONE SYSTEM ONLINE",
        subtitle: "Something's moving. Keep going.",
      };
    case 2:
      return {
        title: "OKAY, WE'RE GETTING SOMEWHERE",
        subtitle: "Two down. One to go.",
      };
    case 3:
      return {
        title: "ALL SYSTEMS ONLINE",
        subtitle: "👏👏👏 Three claps. You know the protocol.",
      };
    default:
      return {
        title: "SYSTEM OFFLINE",
        subtitle: "Brain, body and business — none of them have clocked in yet.",
      };
  }
}
