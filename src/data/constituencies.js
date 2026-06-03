// District -> Assembly constituency map.
//
// This is generated from the LIVE backend database
// (https://vanigan-app-automation-5il0.onrender.com) so the district and
// assembly names here exactly match the values stored on business records.
// Keeping these in sync is critical: the public businesses API filters by the
// raw `district` / `assembly` strings, so any mismatch silently returns zero
// results. Regenerate with build_district_map.js if the DB changes.
export const districtAssemblies = {
  Ariyalur: ['Ariyalur', 'Jayankondam'],
  Chengalpattu: ['Chengalpattu', 'Cheyyur', 'Madurantakam', 'Pallavaram', 'Shozhinganallur', 'Tambaram', 'Thiruporur'],
  Chennai: ['Anna Nagar', 'Chepauk-Thiruvallikeni', 'Dr.Radhakrishnan Nagar', 'Egmore', 'Harbour', 'Kolathur', 'Mylapore', 'Perambur', 'Royapuram', 'Saidapet', 'Thiru-Vi-Ka-Nagar', 'Thiyagarayanagar', 'Thousand Lights', 'Velachery', 'Villivakkam', 'Virugampakkam'],
  Coimbatore: ['Coimbatore (North)', 'Coimbatore (South)', 'Kavundampalayam', 'Kinathukadavu', 'Mettuppalayam', 'Pollachi', 'Singanallur', 'Sulur', 'Thondamuthur', 'Valparai'],
  Cuddalore: ['Bhuvanagiri', 'Chidambaram', 'Cuddalore', 'Kattumannarkoil', 'Kurinjipadi', 'Neyveli', 'Panruti', 'Tittakudi', 'Vriddhachalam'],
  Dharmapuri: ['Dharmapuri', 'Harur', 'Palacodu', 'Pappireddipatti', 'Pennagaram'],
  Dindigul: ['Athoor', 'Dindigul', 'Natham', 'Nilakkottai', 'Oddanchatram', 'Palani', 'Vedasandur'],
  Erode: ['Anthiyur', 'Bhavani', 'Bhavanisagar', 'Erode (East)', 'Erode (West)', 'Gobichettipalayam', 'Modakkurichi', 'Perundurai'],
  Kallakuruchi: ['Kallakurichi', 'Rishivandiyam', 'Sankarapuram', 'Ulundurpettai'],
  Kancheepuram: ['Alandur', 'Kancheepuram', 'Sriperumbudur', 'Uthiramerur'],
  Kanniyakumari: ['Colachal', 'Kanniyakumari', 'Killiyoor', 'Nagercoil', 'Padmanabhapuram', 'Vilavancode'],
  Karur: ['Aravakurichi', 'Karur', 'Krishnarayapuram', 'Kulithalai'],
  Krishnagiri: ['Bargur', 'Hosur', 'Krishnagiri', 'Thalli', 'Uthangarai', 'Veppanahalli'],
  Madurai: ['Madurai Central', 'Madurai East', 'Madurai North', 'Madurai South', 'Madurai West', 'Melur', 'Sholavandan', 'Thirumangalam', 'Thiruparankundram', 'Usilampatti'],
  Mayiladuthurai: ['Mayiladuthurai', 'Poompuhar', 'Sirkazhi'],
  Nagapattinam: ['Kilvelur', 'Nagapattinam', 'Vedaranyam'],
  Namakkal: ['Kumarapalayam', 'Namakkal', 'Paramathi-Velur', 'Rasipuram', 'Senthamangalam', 'Tiruchengodu'],
  Nilgiris: ['Coonoor', 'Gudalur', 'Udhagamandalam'],
  Perambalur: ['Kunnam', 'Perambalur'],
  Pudukottai: ['Alangudi', 'Aranthangi', 'Gandarvakkottai', 'Pudukkottai', 'Thirumayam', 'Viralimalai'],
  Ramanathapuram: ['Mudhukulathur', 'Paramakudi', 'Ramanathapuram', 'Tiruvadanai'],
  Ranipet: ['Arakkonam', 'Arcot', 'Ranipet', 'Sholinghur'],
  Salem: ['Attur', 'Edappadi', 'Gangavalli', 'Mettur', 'Omalur', 'Salem (North)', 'Salem (South)', 'Salem (West)', 'Sankari', 'Veerapandi', 'Yercaud'],
  Sivaganga: ['Karaikudi', 'Manamadurai', 'Sivaganga', 'Tiruppattur'],
  Tenkasi: ['Alangulam', 'Kadayanallur', 'Sankarankovil', 'Tenkasi', 'Vasudevanallur'],
  Thanjavur: ['Kumbakonam', 'Orathanadu', 'Papanasam', 'Pattukkottai', 'Peravurani', 'Thanjavur', 'Thiruvaiyaru', 'Thiruvidaimarudur'],
  Theni: ['Andipatti', 'Bodinayakanur', 'Cumbum', 'Periyakulam'],
  Thiruvallur: ['Ambattur', 'Avadi', 'Gummidipoondi', 'Madavaram', 'Maduravoyal', 'Ponneri', 'Poonamallee', 'Thiruvallur', 'Thiruvottiyur', 'Tiruttani'],
  Thiruvarur: ['Mannargudi', 'Nannilam', 'Thiruthuraipoondi', 'Thiruvarur'],
  Thoothukudi: ['Kovilpatti', 'Ottapidaram', 'Srivaikuntam', 'Thoothukkudi', 'Tiruchendur', 'Vilathikulam'],
  Tiruchirapalli: ['Lalgudi', 'Manachanallur', 'Manapparai', 'Musiri', 'Srirangam', 'Thiruverumbur', 'Thuraiyur', 'Tiruchirappalli (East)'],
  Tirunelveli: ['Ambasamudram', 'Nanguneri', 'Palayamkottai', 'Radhapuram', 'Tirunelveli'],
  Tirupathur: ['Ambur', 'Jolarpet', 'Tirupattur', 'Vaniyambadi'],
  Tiruppur: ['Avanashi', 'Dharapuram', 'Kangayam', 'Madathukulam', 'Palladam', 'Tiruppur (North)', 'Tiruppur (South)', 'Udumalaipettai'],
  Tiruvannamalai: ['Arani', 'Chengam', 'Cheyyar', 'Kalasapakkam', 'Kilpennathur', 'Polur', 'Tiruvannamalai', 'Vandavasi'],
  Vellore: ['Anaikattu', 'Gudiyattam', 'Katpadi', 'Kilvaithinankuppam', 'Vellore'],
  Vilupuram: ['Mailam', 'Tindivanam', 'Tirukkoyilur', 'Vanur', 'Vikravandi', 'Viluppuram'],
  Virudhunagar: ['Aruppukkottai', 'Rajapalayam', 'Sattur', 'Sivakasi', 'Srivilliputhur', 'Tiruchuli', 'Virudhunagar'],
};

// Convenience list of district names (sorted), matching the DB exactly.
export const districts = Object.keys(districtAssemblies).sort((a, b) => a.localeCompare(b));
