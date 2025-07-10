export interface EmojiCategory {
  label: string;
  emojis: string[];
}

export const ICON_CATEGORIES: EmojiCategory[] = [
  {
    label: 'Rostos e Emoções',
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😎", "🤓", "🥳", "😴", "😤", "😭", "😡", "😬", "🤔", "😶", "😐", "🤯"],
  },
  {
    label: 'Símbolos e Ações',
    emojis: ["✅", "📝", "📌", "📎", "🗂️", "📅", "📖", "📚", "✏️", "🖋️", "🗒️", "📂", "📁", "🗃️", "📊", "📈", "📉", "📥", "📤", "🔖", "🗳️", "🔍", "🔎", "💬", "📣", "📢"],
  },
  {
    label: 'Trabalho e Tecnologia',
    emojis: ["💻", "🖥️", "🖨️", "🗄️", "📱", "📷", "🎥", "📡", "🔒", "🔑", "🧑‍💻", "🛠️", "⚙️", "🧰", "📶", "🧪", "🧬", "💾", "💿", "🖱️", "🕹️"],
  },
  {
    label: 'Diversos',
    emojis: ["🔥", "🎯", "🚀", "💡", "🎉", "❤️", "⭐", "🌈", "🧠", "⚡", "🖼️", "🎵", "🎨", "🌟", "📍", "🧭", "🕰️", "🌍", "🌙"],
  },
  {
    label: 'Comida e Bebida',
    emojis: ["🍎", "🍕", "🍔", "🍩", "🍰", "🥗", "🍜", "☕", "🍺", "🥤"],
  },
  {
    label: 'Viagem e Lugares',
    emojis: ["✈️", "🏖️", "🗺️", "🏕️", "🏔️", "🏛️", "🚗", "🛤️", "🚉", "🚢"],
  },
  {
    label: 'Organização e Planejamento',
    emojis: ["🗓️", "🕒", "⏰", "📆", "📝", "📋", "🧾", "🗃️", "📤", "📥"],
  },
];