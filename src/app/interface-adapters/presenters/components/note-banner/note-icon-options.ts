/** Representa uma categoria de emojis com rótulo e lista de emojis. */
export interface EmojiCategory {
  label: string;
  emojis: string[];
}

/** Lista de categorias de ícones/emojis disponíveis para representar notas. */
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