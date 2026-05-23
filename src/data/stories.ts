export interface Story {
  id: string;
  title: string;
  category: string;
  icon: string;
}

const titles = [
  "The Whispering Closet", "Midnight Footsteps", "Eyes in the Mirror", "The Weeping Willow",
  "Shadows of the Attic", "The Vanishing Hitchhiker", "Hollow Creek", "The Red Room",
  "Unheard Screams", "The Doll's Revenge", "A Graveyard Appointment", "The Cursed Diary",
  "Whispers in the Dark", "The Black Cat's Curse", "Phantom of the Opera House", "The Haunted Portrait",
  "Screams of the Silent", "The Ghostly Bride", "The Secret of the Cellar", "Night of the Howling",
  "The Foggy Bridge", "Shadows on the Wall", "The Dead Man's Clock", "Cries from the Woods",
  "The Blood-Red Moon", "Ghostly Giggles", "The Haunting of Hill House", "The Poltergeist's Prank",
  "The Silent Library", "The Giggling Ghost", "The Darkest Night", "The Phantom Rider",
  "The Creeping Terror", "The Demon's Doorway", "The Curse of the Mummy", "Screams of the Banshee",
  "The Haunted Lighthouse", "Phantom of the Lake", "The Shadow in the Corner", "The Cursed Mirror",
  "The Whispering Woods", "Night of the Living Dead", "The Haunted Asylum", "Shadowy Figures",
  "The Ghostly Train", "The Secret of the Tomb", "The Blood-Stained Floor", "The Haunting of the Old Mill",
  "Cries in the Night", "The Ghost Bride's Curse", "The Shadow's Whisper", "The Cursed Amulet",
  "The Haunted Carnival", "The Phantom of the Museum", "The Night of the Gargoyles"
];

const cats = ["Supernatural", "Urban Legend", "Psychological", "Ghost Story", "Possession", "Slaughter"];
const icons = ["ghost", "skull", "flame", "moon", "eye", "wind"];

export const staticStories: Story[] = Array.from({ length: 55 }, (_, i) => ({
  id: `story-${i + 1}`,
  title: titles[i] || `Horror Tale #${i + 1}`,
  category: cats[i % cats.length],
  icon: icons[i % icons.length],
}));
