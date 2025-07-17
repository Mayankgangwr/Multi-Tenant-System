const getNameInitial = (name) => {
    if (!name || !name.trim()) return "";

    const parts = name.trim().split(" ");
    const firstWord = parts[0] || "";
    const secondWord = parts[1] || "";

    const firstInitial = firstWord.charAt(0).toUpperCase() || "";
    let secondInitial = "";

    if (secondWord) {
        secondInitial = secondWord.charAt(0).toUpperCase();
    } else if (firstWord.length > 1) {
        secondInitial = firstWord.charAt(1).toUpperCase();
    }

    return [firstInitial, secondInitial].filter(Boolean).join(" ");
};

console.log(getNameInitial("England     U19"));
