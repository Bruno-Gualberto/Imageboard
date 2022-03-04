const dateHelper = timestamp => {
    let wholeDate = new Date(timestamp.created_at).toDateString();
    const date = `${wholeDate.split(" ").splice(2, 1).join("")} ${wholeDate.split(" ").splice(1, 1).join("")} ${wholeDate.split(" ").splice(3, 1).join("")}`;
    timestamp.created_at = date;
}

export default dateHelper;