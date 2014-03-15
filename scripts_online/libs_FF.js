/*********************************************************************************
*    This file is part of Mountyzilla.                                           *
*                                                                                *
*    Mountyzilla is free software; you can redistribute it and/or modify         *
*    it under the terms of the GNU General Public License as published by        *
*    the Free Software Foundation; either version 2 of the License, or           *
*    (at your option) any later version.                                         *
*                                                                                *
*    Mountyzilla is distributed in the hope that it will be useful,              *
*    but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*    GNU General Public License for more details.                                *
*                                                                                *
*    You should have received a copy of the GNU General Public License           *
*    along with Mountyzilla; if not, write to the Free Software                  *
*    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*********************************************************************************/

/* TODO
 * - revoir la gestion des CdM --> nott armure magique
 * - revoir tout ce qui est li� � la vue (estimateurs d�g nott)
 * - v�rfier la gestion des enchants
 * v1.2.2.3 - 2013-04-21
 * - correction displayScriptTime (nouveau footer)
 * v1.2.2.3b - 2013-05-08
 * - impl�mentation sans usage de binom (remplacera cnp)
 * v1.2.2.4 - 2013-08-19
 * - correction syntaxe alert
 * v1.3 - 2013-12-13
 * - modification arrayTalents, getSortComp, setSortComp
 * v1.3.1 - 2013-12-28
 * - all�gement de code arrayTalents
 * v1.3.2 - 2013-12-30
 * - all�gements de code divers
 * v1.3.3 - 2014-01-01
 * - gestion pi�ges
 */

var poissotron = 'http://minitilk.fur4x-hebergement.net/getDice2.php';

/*                           mise � jour de variables globales utiles                            */

var numTroll = MZ_getValue('NUM_TROLL'); // utilis� pour acc�s bdd (un peu partout)
var nivTroll = MZ_getValue('NIV_TROLL'); // utilis� dans vue pour PX
var mmTroll = MZ_getValue(numTroll+'.caracs.mm'); // utilis� dans actions et vue (calculs SR)
var rmTroll = MZ_getValue(numTroll+'.caracs.rm'); // utilis� dans actions et vue (calculs SR)


/*                                  Fonctions dur�e de script                                    */
var date_debut = null;

function start_script(nbJours_exp) {
	if(date_debut) return;
	date_debut = new Date();
	// Cr�� la variable expdate si demand�
	if(nbJours_exp) {
		expdate = new Date();
		expdate.setTime(expdate.getTime()+nbJours_exp*864e5);
		}
	}

function displayScriptTime() {
	var footerNode = document.getElementById('footer2');
	if(!footerNode) return;
	try{
	var node = document.evaluate(".//text()[contains(.,'Page g�n�r�e en')]/../br",
								footerNode, null, 9, null).singleNodeValue;
	}
	catch(e){return;}
	insertText(node,
		' - [Script ex�cut� en '+(new Date().getTime()-date_debut.getTime())/1000+' sec.]');
	}


/*                                     Insertion de scripts                                      */

function isPage(url) {
	return currentURL.indexOf(MHURL + url) == 0;
}

function chargerScript(script) {
	// (mauvaise) D�tection du chargement de la page
	if(document.getElementsByTagName('A').length > 0)
		appendNewScript(script.indexOf('http://') != -1 ? script : scriptsMZ+script+'_FF.js');
}

function addScript(src) {
	var newScript = document.createElement('script');
	newScript.setAttribute('language', 'JavaScript');
	newScript.setAttribute('src', src);
	var parent = document.body;
	parent.appendChild(newScript);
	return newScript;
}

function appendNewScript(src, paren) {
	MZ_appendNewScript(src);
}


/*                             Modifications du DOM                             */

function insertBefore(next, el) {
	next.parentNode.insertBefore(el, next);
	}

function appendTr(tbody, clas) {
	var tr = document.createElement('tr');
	if(clas) tr.className = clas;
	tbody.appendChild(tr);
	return tr;
	}

function insertTr(next, clas) {
	var tr = document.createElement('tr');
	if(clas) tr.className = clas;
	insertBefore(next, tr);
	return tr;
	}

function appendTd(tr) {
	var td = document.createElement('td');
	if(tr) tr.appendChild(td);
	return td;	
	}

function insertTd(next) {
	var td = document.createElement('td');
	insertBefore(next, td);
	return td;
	}

function appendTdCenter(tr, colspan) {
	var td = appendTd(tr);
	td.align = 'center'; // WARNING - Obsolete
	if(colspan) td.colSpan = colspan;
	return td;
	}

function insertTdElement(next, el) {
	var td = insertTd(next);
	if(el) td.appendChild(el);
	return td;
	}

function appendText(paren, text, bold) {
	if(bold) {
		var b = document.createElement('b');
		b.appendChild(document.createTextNode(text));
		paren.appendChild(b);
		}
	else
		paren.appendChild(document.createTextNode(text));
	}

function insertText(next, text, bold) {
	if(bold) {
		var b = document.createElement('b');
		appendText(b, text);
		insertBefore(next, b);
		}
	else
		insertBefore(next, document.createTextNode(text));
	}

function appendTdText(tr, text, bold) {
	var td = appendTd(tr);
	appendText(td, text, bold);
	return td;
	}

function insertTdText(next, text, bold) {
	var td = insertTd(next);
	appendText(td, text, bold);
	return td;
	}

function appendBr(paren) {
	paren.appendChild(document.createElement('br'));
	}

function insertBr(next) {
	insertBefore(next, document.createElement('br'));
	}

function appendLI(ul, text) { // uniquement utilis� dans les options (cr�dits)
	var li = document.createElement('li');
	appendText(li, text);
	ul.appendChild(li);
	return li;
	}

function appendTextbox(paren, type, nam, size, maxlength, value) {
	var input = document.createElement('input');
	input.className = 'TextboxV2';
	input.type = type;
	input.name = nam;
	input.id = nam;
	input.size = size;
	input.maxlength = maxlength;
	if(value) input.value = value;
	paren.appendChild(input);
	return input;
	}

function appendCheckBox(paren, nam, checked, onClick) {
	var input = document.createElement('input');
	input.type = 'checkbox';
	input.name = nam;
	input.id = nam;
	if(checked) input.checked = true;
	if(onClick) input.onclick = onClick;
	paren.appendChild(input);
	return input;
	}

function appendNobr(paren, id, delgg, text) {
	var nobr = document.createElement('nobr');
	appendCheckBox(nobr,id,null,delgg);
	appendText(nobr,text);
	paren.appendChild(nobr);
	appendText(paren,'   ');
	return nobr;
	}

function appendOption(select, value, text) {
	var option = document.createElement('option');
	option.value = value;
	appendText(option, text);
	select.appendChild(option);
	return option;
	}

function appendHidden(form, nam, value) {
	var input = document.createElement('input');
	input.type = 'hidden';
	input.name = nam;
	input.id = nam;
	input.value = value;
	form.appendChild(input);
	}

function appendButton(paren, value, onClick) {
	var input = document.createElement('input');
	input.type = 'button';
	input.className = 'mh_form_submit';
	input.value = value;
	input.onmouseover = function(){this.style.cursor='pointer';};
	input.onclick = onClick;
	paren.appendChild(input);
	return input;
	}

function insertButton(next, value, onClick) {
	var input = document.createElement('input');
	input.type = 'button';
	input.className = 'mh_form_submit';
	input.value = value;
	input.onmouseover = function(){this.style.cursor='pointer';};
	input.onclick = onClick;
	insertBefore(next,input);
	return input;
	}

function appendSubmit(paren, value, onClick) {
	var input = document.createElement('input');
	input.type = 'submit';
	input.className = 'mh_form_submit';
	input.value = value;
	input.onmouseover = function(){this.style.cursor='pointer';};
	if(onClick) input.onclick = onClick;
	paren.appendChild(input);
	return input;
	}

function createImage(url, text) {
	var img = document.createElement('img');
	img.src = url;
	img.title = text;
	img.align = 'ABSMIDDLE'; // WARNING - Obsolete
	return img;
	}

function createCase(titre, table, width) {
	if(!width) width=120;
	var tr = appendTr(table, 'mh_tdpage');
	
	var td = appendTdText(tr, titre, true);
	td.className = 'mh_tdtitre';
	td.width = width;
	
	td = appendTdText(tr, '');
	td.className = 'mh_tdpage';
	return td;
	}

function getMyID(e) {
	var parent = e.parentNode;
	for(var i=0 ; i<parent.childNodes.length ; i++) {
		if(e==parent.childNodes[i])
			return i;
		}
	return -1;
	}

function insertAfter(elt,newElt) {
	var id = getMyID(elt);
	if(id==-1) return;
	if(id<elt.parentNode.childNodes.length-1)
		insertBefore(elt.nextSibling,newElt);
	else
		elt.parentNode.appendChild(newElt);
	}


/*                     Fonctions de mise en forme du texte                      */

function aff(nb) {
	return (nb>=0) ? '+'+nb : nb;
	}

function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g,'');
	}

function epure(texte) {
	return texte.replace(/[����]/g,'e').replace(/[���]/g,'a').replace(/�/g,'A')
			.replace(/[���]/g,'u').replace(/[���]/g,'o').replace(/[��]/g,'i').replace(/[�]/g,'c');
	}

function bbcode(texte) {
	return texte.replace(/&/g,'&amp;')
				.replace(/"/g,'&quot;')
				.replace(/</g,'&lt;')
				.replace(/>/g,'&gt;')
				.replace(/'/g,'&#146;')
				.replace(/\[b\](.*?)\[\/b\]/g,'<b>$1</b>')
				.replace(/\[i\](.*?)\[\/i\]/g,'<i>$1</i>')
				.replace(/\[img\]([^"]*?)\[\/img\]/g,'<img src="$1" />');
	}


/*                              Gestion / Transformation des Dates                               */

function addZero(i) {
	return (i<10) ? '0'+i : i;
	}

function DateToString(date) {
	return addZero(date.getDate())+'/'+addZero(date.getMonth()+1)+'/'+date.getFullYear()+' '
		+addZero(date.getHours())+':'+addZero(date.getMinutes())+':'+addZero(date.getSeconds());
	}

function StringToDate(str) {
	return str.replace(/([0-9]+)\/([0-9]+)/,"$2/$1");
	}


/*                                     Stockage des Talents                                      */

arrayTalents = {
	/* Comp�tences */
	'Acceleration du Metabolisme':'AM',
	'Attaque Precise':'AP',
	'Balayage':'Balayage',
	'Balluchonnage':'Ballu',
	'Baroufle':'Baroufle',
	'Bidouille':'Bidouille',
	'Botte Secrete':'BS',
	'Camouflage':'Camou',
	'Charger':'Charger',
	'Connaissance des Monstres':'CdM',
	//'Construire un Piege':'Piege',
	'Piege a Feu':'PiegeFeu',
	'Piege a Glue':'PiegeGlue',
	'Contre-Attaquer':'CA',
	'Coup de Butoir':'CdB',
	'Course':'Course',
	'Deplacement Eclair':'DE',
	'Dressage':'Dressage',
	'Ecriture Magique':'EM',
	'Frenesie':'Frenesie',
	//'Golemologie':'Golemo',
	'Golem de cuir':'GolemCuir',
	'Golem de metal':'GolemMetal',
	'Golem de mithril':'GolemMithril',
	'Golem de papier':'GolemPapier',
	'Grattage':'Grattage',
	'Hurlement Effrayant':'HE',
	'Identification des Champignons':'IdC',
	'Insultes':'Insultes',
	'Lancer de Potions':'LdP',
	'Marquage':'Marquage',
	'Melange Magique':'Melange',
	'Miner':'Miner',
	'Necromancie':'Necro',
	'Painthure de Guerre':'PG',
	'Parer':'Parer',
	'Pistage':'Pistage',
	'Planter un Champignon':'PuC',
	'Regeneration Accrue':'RA',
	'Reparation':'Reparation',
	'Retraite':'Retraite',
	'Rotobaffe':'RB',
	'Shamaner':'Shamaner',
	"S'interposer":'SInterposer',
	'Tailler':'Tailler',
	//'Vol':'Vol',
	/* Sortil�ges */
	'Analyse Anatomique':'AA',
	'Armure Etheree':'AE',
	'Augmentation de l�Attaque':'AdA',
	'Augmentation de l�Esquive':'AdE',
	'Augmentation des Degats':'AdD',
	'Bulle Anti-Magie':'BAM',
	'Bulle Magique':'BuM',
	'Explosion':'Explo',
	'Faiblesse Passagere':'FP',
	'Flash Aveuglant':'FA',
	'Glue':'Glue',
	'Griffe du Sorcier':'GdS',
	'Hypnotisme':'Hypno',
	'Identification des tresors':'IdT',
	'Invisibilite':'Invi',
	'Levitation':'Levitation',
	'Precision Magique':'PreM',
	'Projectile Magique':'Projo',
	'Projection':'Proj',
	'Puissance Magique':'PuM',
	'Rafale Psychique':'Rafale',
	'Sacrifice':'Sacro',
	'Siphon des Ames':'Siphon',
	'Telekinesie':'Telek',
	'Teleportation':'TP',
	'Vampirisme':'Vampi',
	'Vision Accrue':'VA',
	'Vision lointaine':'VL',
	'Voir le Cache':'VlC',
	'Vue Troublee':'VT'
	//'':''
	}

// DEBUG provisoire, pour r�trocompatibilit�
function getSortComp(nom,niveau) {
	return getTalent(nom,niveau);
	}

function getTalent(nom,niveau) {
	var nomEnBase = arrayTalents[epure(nom)];
	if(!nomEnBase) return 0;
	if(!niveau) var niveau = '';
	if(MZ_getValue(numTroll+'.talent.'+nomEnBase+niveau))
		return MZ_getValue(numTroll+'.talent.'+nomEnBase+niveau);
	return 0;
	}

function removeAllTalents() {
	for(var talent in arrayTalents) {
		var nomEnBase = arrayTalents[talent];
		if(MZ_getValue(numTroll+'.talent.'+nomEnBase)) {
			MZ_removeValue(numTroll+'.talent.'+nomEnBase);
			return;
			}
		var niveau = 1;
		while(MZ_getValue(numTroll+'.talent.'+nomEnBase+niveau)) {
			MZ_removeValue(numTroll+'.talent.'+nomEnBase+niveau);
			niveau++;
			}
		}
	}

function isProfilActif() { // what for ? 
	var att = MZ_getValue(numTroll+'.caracs.attaque');
	var attbmp = MZ_getValue(numTroll+'.caracs.attaque.bmp');;
	var attbmm = MZ_getValue(numTroll+'.caracs.attaque.bmm');;
	var mm = MZ_getValue(numTroll+'.caracs.mm');
	var deg = MZ_getValue(numTroll+'.caracs.degats');
	var degbmp = MZ_getValue(numTroll+'.caracs.degats.bmp');
	var degbmm = MZ_getValue(numTroll+'.caracs.degats.bmm');
	var vue = MZ_getValue(numTroll+'.caracs.vue');
	var bmvue = MZ_getValue(numTroll+'.caracs.vue.bm');
	if(att==null || attbmp==null || attbmm==null || mm==null || deg==null
		|| degbmp==null || degbmm==null || vue==null || bmvue==null)
		return false;
	return true;
	}


/*********************************************************************************
*                               Gestions des CDMs                                *
*********************************************************************************/

function getPVsRestants(pv, bless, vue) {
	bless = parseInt(bless.match(/\d+/));
	if(bless==0)
		return null;
	var pvminmax = pv.match(/\d+/g);
	if(bless==95) {
		var pvb = 1;
		var pvh = Math.floor( pvminmax[1]/20 );
		}
	else if(bless==5) {
		var pvb = Math.floor( pvminmax[0]*19/20 );
		var pvh = pvminmax[1];
		}
	else {
		var pvb = Math.ceil( pvminmax[0]*(95-bless) / 100 );
		var pvh = Math.floor( pvminmax[1]*(105-bless) / 100 );
		}
	return vue ? ' ('+pvb+'-'+pvh+')' : ['Points de Vie restants : ','Entre '+pvb+' et '+pvh];
	}

function insertButtonCdm(nextName, onClick, texte) {
	if(texte==null) texte = 'Participer au bestiaire';
	var nextNode = document.getElementsByName(nextName)[0];

	var espace = document.createTextNode('\t');
	insertBefore(nextNode, espace);

	var button = document.createElement('input');
	button.type = 'button';
	button.className = 'mh_form_submit';
	button.value = texte;
	button.onmouseover = function(){this.style.cursor='pointer';};
	if(onClick)  button.onclick = onClick;
	insertBefore(espace, button);
	return button;
	}

var listeTitres = ['Niveau','Famille','Points de Vie','Blessure','Attaque','Esquive','D�g�ts',
			'R�g�n�ration','Armure','Vue','Capacit� sp�ciale','R�sistance Magique','Autres'];
		
function createCDMTable(id,nom,donneesMonstre) {
try {
	var urlImg = 'http://mountyzilla.tilk.info/scripts_0.9/images/';
	var table = document.createElement('table');
	var profilActif = isProfilActif();
	table.className = 'mh_tdborder';
	table.border = 0;
	table.cellSpacing = 1;
	table.cellPadding = 4;
	
	var thead = document.createElement('thead');
	var tr = appendTr(thead,'mh_tdtitre');
	var td = appendTdText(tr,
						'CDM de '+nom+ (donneesMonstre[11]!='???' ? ' (N� '+id+')' : ''),
						true);
	td.colSpan = 2;
	table.appendChild(thead);
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);

	for(var i=0; i<listeTitres.length-3 ; i++)
		 createCase(listeTitres[i],tbody,80);
	var TypeMonstre = getEM(nom);
	var infosCompo='';
	if(TypeMonstre!='')
	   infosCompo = compoEM(TypeMonstre);

	var nodes = tbody.childNodes;
	nodes[0].childNodes[1].innerHTML = bbcode(donneesMonstre[0]) + analysePX(bbcode(donneesMonstre[0]));
	nodes[1].childNodes[1].firstChild.nodeValue = bbcode(donneesMonstre[1]);
	nodes[2].childNodes[1].innerHTML = bbcode(donneesMonstre[2]);
	nodes[3].childNodes[1].innerHTML = bbcode(donneesMonstre[11]);
	nodes[4].childNodes[1].innerHTML = bbcode(donneesMonstre[3]);
	nodes[5].childNodes[1].innerHTML = bbcode(donneesMonstre[4]);
	nodes[6].childNodes[1].innerHTML = bbcode(donneesMonstre[5]);
	nodes[7].childNodes[1].innerHTML = bbcode(donneesMonstre[6]);
	nodes[8].childNodes[1].innerHTML = bbcode(donneesMonstre[7]);
	nodes[9].childNodes[1].innerHTML = bbcode(donneesMonstre[8]);
	if(donneesMonstre[10] && donneesMonstre[10].length>0) {
		td = createCase(listeTitres[10],tbody);
		td.innerHTML = bbcode(donneesMonstre[10]);
		if(donneesMonstre[16] && donneesMonstre[16].length>0) {
			td.appendChild(document.createTextNode(" "));
			if(donneesMonstre[16] == "De zone")
				td.appendChild(createImage(urlImg+"zone.gif", "Port�e : Zone"));
			else if(donneesMonstre[16] == "Automatique")
				td.appendChild(createImage(urlImg+"automatique.gif", "Toucher automatique"));
			else if(donneesMonstre[16] == "Au toucher")
				td.appendChild(createImage(urlImg+"toucher.gif", "Pouvoir au toucher"));
			}
		}
	if(donneesMonstre[9] && donneesMonstre[9].length>0)
	{
		td = createCase(listeTitres[11],tbody);
		td.innerHTML = bbcode(donneesMonstre[9]);
		// seuil de r�sistance du monstre
		var lb = td.getElementsByTagName('b');
		if(lb.length == 1) {
			var mrm = lb[0].firstChild.nodeValue * 1;
			var v = (mrm / mmTroll);
			lb[0].firstChild.nodeValue += " ("
					+ (mrm < mmTroll ? Math.max(10, Math.floor(v*50)) : Math.min(90, Math.floor(100 - 50/v))) + " %)";
		}
	}
	
	if(donneesMonstre[12]>0 || donneesMonstre[13]>=0 || donneesMonstre[14]>0 || donneesMonstre[15].length>0
		|| (donneesMonstre[17] && donneesMonstre[17].length>0)
		|| infosCompo.length>0 || nom.indexOf("Gowap Apprivois�")==-1)
	{
		
		td = createCase(listeTitres[12],tbody);
		if(donneesMonstre[12]==1)
		{
			td.appendChild(createImage(urlImg+"oeil.gif", "Voit le cach�"));
		}
		if(donneesMonstre[13]==1)
		{
			td.appendChild(createImage(urlImg+"distance.gif", "Attaque � distance"));
		}
		else if(donneesMonstre[13]==0)
		{
			td.appendChild(createImage(urlImg+"cac.gif", "Corps � corps"));
		}
		if(donneesMonstre[14]==1)
		{
			td.appendChild(createImage(urlImg+"1.gif", "1 attaque par tour"));
		}
		if(donneesMonstre[14]>1 && donneesMonstre[14]<=6)
		{
			td.appendChild(createImage(urlImg+donneesMonstre[14]+".gif", donneesMonstre[14]+" attaque(s) par tour"));
		}
		else if(donneesMonstre[14]>6)
		{
			td.appendChild(createImage(urlImg+"plus.gif","Beaucoup d'attaques par tour"));
		}
		if(donneesMonstre[15]=="Lente")
		{
			td.appendChild(createImage(urlImg+"lent.gif","Lent � se d�placer"));
		}
		else if(donneesMonstre[15]=="Normale")
		{
			td.appendChild(createImage(urlImg+"normal.gif","Vitesse normale de d�placement"));
		}
		else if(donneesMonstre[15]=="Rapide")
		{
			td.appendChild(createImage(urlImg+"rapide.gif","D�placement rapide"));
		}
		if(donneesMonstre[17] && donneesMonstre[17].length>0 && donneesMonstre[17]!="Vide")
		{
			td.appendChild(createImage(urlImg+"charge2.gif","Poss�de de l'�quipement ("+donneesMonstre[17]+")"));
		}
		if(infosCompo.length>0)
		{
			td.appendChild(createImage(urlImg+"Competences/ecritureMagique.png",infosCompo));
		}
		if(profilActif && nom.indexOf("Gowap Apprivois�")==-1 && nom.indexOf("Gowap Sauvage")==-1)
		{
			td.appendChild(createPopupImage2(urlImg+"calc.png", id, nom));
		}
	}
	
	// pourcentage de blessure
	lb = nodes[3].childNodes[1].getElementsByTagName('b');
	if(lb.length == 1 && donneesMonstre[2].indexOf("-") != -1) {
		var pvs = getPVsRestants(donneesMonstre[2], lb[0].firstChild.nodeValue, true);
		if(pvs)
			lb[0].firstChild.nodeValue += pvs;
	}
	return table;
	}
	catch(e){window.alert(e);}
}


/*********************************************************************************
*                           Gestion des enchantements                            *
*********************************************************************************/

var listeMonstreEnchantement = null,
	listeEquipementEnchantement = null,
	listeInfoEnchantement = null;

function computeCompoEnchantement()
{
	listeMonstreEnchantement = new Array();
	listeInfoEnchantement = new Array();
	listeEquipementEnchantement = new Array();
	var liste = MZ_getValue(numTroll+'.enchantement.liste').split(';');
	for(var i=0;i<liste.length;i++)
	{
		var idEquipement = liste[i]*1;
		if(MZ_getValue(numTroll+'.enchantement.'+idEquipement+'.objet')==null || MZ_getValue(numTroll+'.enchantement.'+idEquipement+'.enchanteur')==null)
			continue;
		var nomEquipement = MZ_getValue(numTroll+'.enchantement.'+idEquipement+'.objet');
		var infoEnchanteur = MZ_getValue(numTroll+'.enchantement.'+idEquipement+'.enchanteur').split(';');
		var texteGlobal='';
		for(var j=0;j<3;j++)
		{
			var infoComposant = MZ_getValue(numTroll+'.enchantement.'+idEquipement+'.composant.'+j).split(';');
			listeMonstreEnchantement[infoComposant[2]] = 1;
			var array = new Array();
			array[0]=infoComposant[0].replace("Ril","�il");
			array[1]=infoComposant[1];
			array[2]=infoComposant[2];
			array[3]=getQualite(infoComposant[3]);
			var texte = infoComposant[4].replace("Ril","�il");
			for(var k=5;k<infoComposant.length;k++)
			{
				texte += ";"+infoComposant[k].replace("Ril","�il");
			}
			texteGlobal+=texte+'\n';
			texte += " pour l'enchantement d'un(e) "+nomEquipement+" chez l'enchanteur n�"+infoEnchanteur[0]+' ('+infoEnchanteur[1]+'|'+infoEnchanteur[2]+'|'+infoEnchanteur[3]+')';
			array[4]=texte;
			listeInfoEnchantement.push(array);
		}
		texteGlobal += "chez l'enchanteur n�"+infoEnchanteur[0]+' ('+infoEnchanteur[1]+'|'+infoEnchanteur[2]+'|'+infoEnchanteur[3]+')';
		listeEquipementEnchantement[idEquipement] = texteGlobal;
	}
	
}

function isEnchant(nom) {
	var monstreEnchant = '';
	for(j in listeInfoEnchantement) {
		monstre = listeInfoEnchantement[j][2].toLowerCase();
		if((nom+' ').toLowerCase().indexOf(monstre+' ')>=0){		
			monstreEnchant=monstre;
			break; // �a permet d'arreter de chercher dans le tableau des EM -> on gagne du temps
		}
	}
	return trim(monstreEnchant);
}

function getInfoEnchantementFromMonstre(nom)
{
	try
	{
		if(!listeMonstreEnchantement)
		{
			computeCompoEnchantement();
		}
		var infosEnchant = '';
		for(j in listeInfoEnchantement) {
			monstre = listeInfoEnchantement[j][2].toLowerCase();
			if((nom+' ').toLowerCase().indexOf(monstre+' ')>=0){		
				if(infosEnchant=='')
					infosEnchant=listeInfoEnchantement[j][4];
				else
					infosEnchant+='\n'+listeInfoEnchantement[j][4];
			}
		}
		return trim(infosEnchant);
	}
	catch(e)
	{
		window.alert(e);
	}
}

function composantEnchant(Monstre, composant, localisation,qualite) {
     var compo='';
	for(var i=0; i<listeInfoEnchantement.length; i++) {
	 	if(listeInfoEnchantement[i][2].toLowerCase()==Monstre.toLowerCase() && 
			listeInfoEnchantement[i][0].toLowerCase()==composant.toLowerCase() && 
			listeInfoEnchantement[i][1].toLowerCase()==localisation.toLowerCase() && 
			listeInfoEnchantement[i][3]<=qualite
		) {
			return listeInfoEnchantement[i][4];
		}
	}
	return compo;     
}

function insertEnchantInfos(tbody) {
	try
	{
		if(!listeMonstreEnchantement)
			computeCompoEnchantement();
		var nodes = document.evaluate("descendant::img[@alt = 'Composant - Sp�cial']",
				tbody, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if(nodes.snapshotLength == 0)
			return false;
		var urlImg = 'http://mountyzilla.tilk.info/scripts_0.9/images/enchant.png';
		for(var i = 0; i < nodes.snapshotLength; i++) {
			var link = nodes.snapshotItem(i).nextSibling.nextSibling;
			var nomCompoTotal = link.firstChild.nodeValue.replace(/\240/g, ' ');
			var nomCompo = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" d'un"));
			nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf("d'un"),nomCompoTotal.length);
			nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf(' ')+1,nomCompoTotal.length);
			var nomMonstre = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" de Qualit�"));
			var qualite = nomCompoTotal.substring(nomCompoTotal.indexOf("de Qualit�")+11,nomCompoTotal.indexOf(' ['));
			var localisation = nomCompoTotal.substring(nomCompoTotal.indexOf('[')+1,nomCompoTotal.indexOf(']'));
			if(isEnchant(nomMonstre).length>0)
			{
				var infos = composantEnchant(nomMonstre, nomCompo, localisation,getQualite(qualite));
				if(infos.length>0)
				{
					if(link.parentNode == link.nextSibling.parentNode)
					{
						var tmp = link.nextSibling;
						link.parentNode.insertBefore(createImage(urlImg,infos), link.nextSibling);
					}
					else
					{
						link.parentNode.appendChild(createImage(urlImg,infos));
					}
				}
			}
		}
	}
	catch(e)
	{
		window.alert(e);
	}
}

function computeEnchantementEquipement(fontionTexte,formateTexte)
{
	try
	{
		if(!listeMonstreEnchantement)
			computeCompoEnchantement();
		var nodes = document.evaluate("//a[@class='AllLinks' and contains(@href,'TresorHistory.php')]",
				document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if(nodes.snapshotLength == 0)
			return false;
		var urlImg = 'http://mountyzilla.tilk.info/scripts_0.9/images/enchant.png';
		for(var i = 0; i < nodes.snapshotLength; i++) 
		{
			var link = nodes.snapshotItem(i);
			var idEquipement = link.getAttribute('href');
			idEquipement = idEquipement.substring(idEquipement.indexOf('ai_IDTresor=')+12);
			idEquipement = parseInt(idEquipement.substring(0,idEquipement.indexOf("'")));
			var nomEquipement = trim(link.firstChild.nodeValue);
			var enchanteur = MZ_getValue(numTroll+'.enchantement.'+idEquipement+'.enchanteur');
			if(!enchanteur || enchanteur == '')
				continue;
			var infos = listeEquipementEnchantement[idEquipement];
			infos=formateTexte(infos);
			if(infos.length>0)
			{
				if(link.parentNode == link.nextSibling.parentNode)
				{
					var tmp = link.nextSibling;
					link.parentNode.insertBefore(fontionTexte(urlImg,infos), link.nextSibling);
				}
				else
				{
					link.parentNode.appendChild(fontionTexte(urlImg,infos));
				}
			}
			MZ_setValue(numTroll+'.enchantement.'+idEquipement+'.objet',nomEquipement+' ('+idEquipement+')');
		}
	}
	catch(e)
	{
		window.alert(e);
	}
}

/*********************************************************************************
*    This  part is a  Zoryazilla  data                  *
*  Gestion des compos EM                         *
*********************************************************************************/

function insertEMInfos(tbody) {
	var nodes = document.evaluate("descendant::img[@alt = 'Composant - Sp�cial']",
			tbody, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if(nodes.snapshotLength == 0)
		return false;
	var urlImg = 'http://mountyzilla.tilk.info/scripts_0.8/images/Competences/ecritureMagique.png';
	for(var i = 0; i < nodes.snapshotLength; i++) {
		var link = nodes.snapshotItem(i).nextSibling.nextSibling;
		var nomCompoTotal = link.firstChild.nodeValue.replace(/\240/g, ' ');
		var nomCompo = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" d'un"));
		nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf("d'un"),nomCompoTotal.length);
		nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf(' ')+1,nomCompoTotal.length);
		var nomMonstre = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" de Qualit�"));
		var qualite = nomCompoTotal.substring(nomCompoTotal.indexOf("de Qualit�")+11,nomCompoTotal.indexOf(' ['));
		var localisation = nomCompoTotal.substring(nomCompoTotal.indexOf('[')+1,nomCompoTotal.indexOf(']'));
		if(isEM(nomMonstre).length>0)
		{
			var infos = composantEM(nomMonstre, nomCompo, localisation,getQualite(qualite));
			if(infos.length>0)
			{
				var shortDescr = 'Variable';
				var bold = 0;
				if(infos != 'Composant variable')
				{
					shortDescr = infos.substring(0,infos.indexOf(' '));
					if(parseInt(shortDescr)>=0)
						bold=1;
				}
				if(link.parentNode == link.nextSibling.parentNode)
				{
					var tmp = link.nextSibling;
					link.parentNode.insertBefore(createImage(urlImg,infos), link.nextSibling);
					insertText(tmp,' ['+shortDescr+']',bold);
				}
				else
				{
					link.parentNode.appendChild(createImage(urlImg,infos));
					appendText(link.parentNode,' ['+shortDescr+']',bold);
				}
			}
		}
	}

}

function getQualite(qualite)
{
	for(var i=0; i<tabQualite.length; i++)
	{
		if(tabQualite[i].toLowerCase()==qualite.toLowerCase())
			return i;
	}
	return -1;
}

function isEM(nom) {
	var monstreEM = '';
	for(j in tabEM) {
		monstre = tabEM[j][0].toLowerCase();
		if((nom+' ').toLowerCase().indexOf(monstre+' ')>=0){		
			monstreEM=monstre;
			break; // �a permet d'arreter de chercher dans le tableau des EM -> on gagne du temps
		}
	}
	return trim(monstreEM);
}

function getEM(nom) {
	var monstreEM = '';
	if(nom.indexOf('[') != -1)
		nom = nom.substring(0,nom.indexOf('['));
	for(j in tabEM) {
		monstre = tabEM[j][0].toLowerCase();
		if(nom.toLowerCase().indexOf(monstre+' ')==0 || nom.toLowerCase().indexOf(' '+monstre+' ')>=0){		
			monstreEM=monstre;
			break; // �a permet d'arreter de chercher dans le tableau des EM -> on gagne du temps
		}
	}
	return trim(monstreEM);
}

function compoEM(Monstre) {
     var compo='';
	for(var i=0; i<tabEM.length; i++) {
	 	if(tabEM[i][0].toLowerCase()==Monstre.toLowerCase()) {
	 	    if(tabEM[i][4]==1)
			    compo='Divers composants '+tabEM[i][1]+' '+tabEM[i][0]+' ('+tabEM[i][2]+')';
  		    else
			    compo=tabEM[i][1]+' '+tabEM[i][0]+" (Qualit� "+tabQualite[tabEM[i][3]]+") pour l'�criture de "+tabEM[i][2];
		}
	}
	return compo;     
}

function composantEM(Monstre, composant, localisation,qualite) {
     var compo='';
	for(var i=0; i<tabEM.length; i++) {
	 	if(tabEM[i][0].toLowerCase()==Monstre.toLowerCase()) {
			if(tabEM[i][4]==0)
			{
				var pourcentage=0;
				if(tabEM[i][1].substring(0,tabEM[i][1].indexOf(" d'un")).toLowerCase()!=composant.toLowerCase())
					pourcentage -= 20;
				pourcentage -= 5 * (tabEM[i][3]-qualite);
				if(localisation.toLowerCase()!=tabEM[i][5].toLowerCase())
					pourcentage -= 5;
				if(pourcentage>=-20)
				{
					if(compo.length>0)
						compo+=' | ';
					compo+=pourcentage+"% pour l'�criture de "+tabEM[i][2];
				}
			}
			else
			{
				if(compo.length>0)
					compo+=' | ';
				compo+='Composant variable';
			}
		}
	}
	return compo;     
}

tabQualite = ['Tr�s Mauvaise','Mauvaise','Moyenne','Bonne','Tr�s Bonne'];

tabEM = [ //Monstre, Compo, Sort EM, TypeEM
["Basilisk","�il d'un ","Analyse Anatomique",2,0,"T�te"],
["Ankheg","Carapace d'un","Armure Eth�r�e",2,0,"Sp�cial"],
["Rocketeux","Tripes d'un","Armure Eth�r�e",3,0,"Corps"],

["Loup-Garou","Bras d'un","Augmentation de l'Attaque",2,0,"Membre"],
["Titan","Griffe d'un","Augmentation de l'Attaque",3,0,"Membre"],

["Erinyes","Plume d'une","Augmentation de l'Esquive",2,0,"Membre"],
["Palefroi Infernal","Sabot d'un","Augmentation de l'Esquive",3,0,"Membre"],

["Manticore","Patte d'une","Augmentation des D�g�ts",2,0,"Membre"],
["Trancheur","Griffe d'un","Augmentation des D�g�ts",3,0,"Membre"],

["Banshee","Peau d'une","Bulle Anti-Magie",2,0,"Corps"],

["Essaim Sanguinaire","Pattes d'un","Bulle Magique",2,0,"Membre"],
["Sagouin","Patte d'un","Bulle Magique",3,0,"Membre"],
["Effrit","Cervelle d'un","Bulle Magique",4,0,"T�te"],

["Diablotin","C�ur d'un","Explosion",2,0,"Corps"],
["Chim�re","Sang d'une","Explosion",3,0,"Corps"],
["Barghest","Bave d'un","Explosion",4,0,"Sp�cial"],

["N�crophage","T�te d'un","Faiblesse Passag�re",2,0,"T�te"],
["Vampire","Canine d'un","Faiblesse Passag�re",3,0,"Sp�cial"],

["Gorgone","Chevelure d'une","Flash Aveuglant",2,0,"T�te"],
["G�ant des Gouffres","Cervelle d'un","Flash Aveuglant",3,0,"T�te"],

["Limace G�ante","Mucus d'une","Glue",2,0,"Sp�cial"],
["Grylle","Gueule d'un","Glue",3,0,"T�te"],

["Abishaii Noir","Serre d'un","Griffe du Sorcier",2,0,"Membre"],
["Vouivre","Venin d'une","Griffe du Sorcier",3,0,"Sp�cial"],
["Araign�e G�ante","Mandibule d'une","Griffe du Sorcier",4,0,"Sp�cial"],

["Nuage d'Insectes","Chitine d'un","Invisibilit�",2,0,"Sp�cial"],
["Yuan-ti","Cervelle d'un","Invisibilit�",3,0,"T�te"],
["Gritche","Epine d'un","Invisibilit�",4,0,"Sp�cial"],

["Y�ti","Jambe d'un","Projection",2,0,"Membre"],
["Djinn","T�te d'un","Projection",3,0,"T�te"],

["Sorci�re","Verrue d'une","Sacrifice",2,0,"Sp�cial"],

["Plante Carnivore","Racine d'une","T�l�kin�sie",2,0,"Sp�cial"],
["Tertre Errant","Cervelle d'un","T�l�kin�sie",3,0,"T�te"],

["Boggart","Main d'un","T�l�portation",2,0,"Membre"],
["Succube","T�ton Aguicheur d'une","T�l�portation",3,0,"Corps"],
["N�crochore","Os d'un","T�l�portation",4,0,"Corps"],

["Abishaii Vert","�il d'un","Vision Accrue",2,0,"T�te"],

["Fungus G�ant","Spore d'un","Vision Lointaine",2,0,"Sp�cial"],
["Abishaii Rouge","Aile d'un","Vision Lointaine",3,0,"Membre"],

["Zombie","Cervelle Putr�fi�e d'un","Voir le Cach�",2,0,"T�te"],
["Shai","Tripes d'un","Voir le Cach�",3,0,"Corps"],
["Phoenix","�il d'un","Voir le Cach�",4,0,"T�te"],

["Naga","Ecaille d'un","Vue Troubl�e",2,0,"Corps"],
["Marilith","Ecaille d'une","Vue Troubl�e",3,0,"Membre"],


["Rat","d'un","Composant variable",-1,1],
["Rat G�ant","d'un","Composant variable",-1,1],
["Dindon","d'un","Composant variable",-1,1],
["Goblin","d'un","Composant variable",-1,1],
["Limace","d'une","Composant variable",-1,1],
["Limace G�ante","d'une","Composant variable",-1,1],
["Ver","d'un","Composant variable",-1,1],
["Ver Carnivore","d'un","Composant variable",-1,1],
["Ver Carnivore G�ant","d'un","Composant variable",-1,1],
["Fungus","d'un","Composant variable",-1,1],
["Vouivre","d'une","Composant variable",-1,1],
["Gnu","d'un","Composant variable",-1,1],
["Scarab�e","d'un","Composant variable",-1,1]

];

var moisChampi = {
	'Pr�scientus Reguis':'du Phoenix',
	'Amanite Trollo�de':'de la Mouche',
	'Girolle Sanglante':'du Dindon',
	'Horreur Des Pr�s':'du Gobelin',
	'Bolet P�teur':'du D�mon',
	'Pied Jaune':'de la Limace',
	'Agaric Sous-Terrain':'du Rat',
	'Suinte Cadavre':"de l'Hydre",
	'C�pe Lumineux':'du Ver',
	'Fungus Rampant':'du Fungus',
	'Nez Noir':'de la Vouivre',
	'Pleurote Pleureuse':'du Gnu',
	'Phytomassus Xil�nique':'du Scarab�e'
	}


/***********************************************
Analyse PX
***********************************************/

function getPXKill(niv) {
	return Math.max(0, 10+3*niv-2*nivTroll);
	}

function getPXDeath(niv) {
	return Math.max(0, 10+3*nivTroll-2*niv);
	}

function analysePX(niv) {
	niv = niv+'';
	var i = niv.indexOf('+');
	if(i!=-1) // si niv = 'XX+' ??
		return ' --> \u2265 <b>'+getPXKill(niv.slice(0,i))+'</b> PX';
	i = niv.slice(1).indexOf('-'); // si niv = 'XX-YY' ??
	if(i!=-1) {
		var max = getPXKill(niv.slice(i+2));
		if(max==0)
			return ' --> <b>0</b> PX';
		return ' --> <b>'+getPXKill(niv.slice(0,i+1))+'</b> \u2264 PX \u2264 <b>'+max+'</b>';
		}
	i = niv.indexOf('='); // ???
	if(i!=-1) {
		var max = getPXKill(niv.slice(i+1));
		return max == 0 ? ' --> <b>0</b> PX' : ' --> \u2264 <b>'+max+'</b> PX';
		}
	return ' --> <b>'+getPXKill(niv)+'</b> PX';
	}

function analysePXTroll(niv) {
	var str = analysePX(niv);
	str += '<br/>Vous lui rapportez <b>'+getPXDeath(niv)+'</b> PX.';
	return str;
	}

/***********************************************
Les % de toucher
***********************************************/

var c = new Array();

// coefficients binomiaux
function cnp(n,k)
{
	if(c[n] != null && c[n][k] != null)
		return c[n][k];
	if(c[n] == null)
		c[n] = new Array();
	if(k==0)
	{
		c[n][k] = 1;
		return 1;
	}
	var result = cnp(n-1,k-1)*n/k; // mouais... k mul+k div
	c[n][k] = result;
	return result;
}

// by Dab, � comparer
function binom(n,p) {
	if(p<0 || p>n) return 0;
	
	if(c[n])
		if(c[n][p]) return c[n][p];
	else {
		c[n]=[1];
		c[n][n]=1;
		if(p==0 || p==n) return 1;
		}
	
	if(2*p>n)
		c[n][p]=binom(n,n-p);
	else
		c[n][p]=binom(n-1,p-1)+binom(n-1,p); // k(k-1)/2 additions
	
	return c[n][p];
	}

var coeff = new Array();

function coef(n,p)
{
	if(n==0 && p==0)
		return 1;
	if(p>n*3.5)
		p = 7*n-p
	if(coeff[n] != null && coeff[n][p] !=null)
		return coeff[n][p];
	if(coeff[n] == null)
		coeff[n] = new Array();
	var kmax = Math.floor((p-n)/6);
	var x=0;
	for(var k=0;k<=kmax;k++)
	{
		x+=(1-2*(k%2)) * cnp(n,k) * cnp(p-6*k-1,n-1);
	}
	coeff[n][p] = x;
	return x;
}

function chanceEsquiveParfaite(a,d,ba,bd)
{
	var win = 0;
	var los = 0;
	if(ba==null)
		ba=0;
	if(bd==null)
		bd=0;
/*	if(6*a+ba<2*(d+bd))
		return 100;
	if(a+ba>2*(6*d+bd))
		return 0;*/
	for(var ds=d;ds<=6*d;ds++)
	{
		var cd = coef(d,ds);
		for(var as=a;as<=6*a;as++)
		{
			if(2*Math.max(as+ba,0) < Math.max(ds+bd,0))
				win += cd * coef(a,as);
			else
				los += cd * coef(a,as);
		}
	}
	return Math.round(100*win/(win+los));
}

function chanceTouche(a,d,ba,bd)
{
	var win = 0;
	var los = 0;
	if(ba==null)
		ba=0;
	if(bd==null)
		bd=0;
	if(a+ba>6*d+bd)
		return 100;
	if(6*a+ba<d+bd)
		return 0;
	for(var ds=d;ds<=6*d;ds++)
	{
		var cd = coef(d,ds);
		for(var as=a;as<=6*a;as++)
		{
			if(Math.max(as+ba,0) > Math.max(ds+bd,0))
				win += cd * coef(a,as);
			else
				los += cd * coef(a,as);
		}
	}
	return Math.round(100*win/(win+los));
}

function chanceCritique(a,d,ba,bd)
{
	var win = 0;
	var los = 0;
	if(ba==null)
		ba=0;
	if(bd==null)
		bd=0;
	if(a+ba>2*(6*d+bd))
		return 100;
	if(6*a+ba<2*(d+bd))
		return 0;
	for(var ds=d;ds<=6*d;ds++)
	{
		var cd = coef(d,ds);
		for(var as=a;as<=6*a;as++)
		{
			if(Math.max(as+ba,0) > 2*Math.max(ds+bd,0))
				win += cd * coef(a,as);
			else
				los += cd * coef(a,as);
		}
	}
	return Math.round(100*win/(win+los));
}

/***********************************************
Analyse tactique
***********************************************/

function getTexteAnalyse(modificateur,chiffre)
{
	if(chiffre==0)
		return chiffre;
	return modificateur+chiffre;
} 

function getAnalyseTactique(id,nom)
{
	var donneesMonstre = listeCDM[id];
	var needAutres=false;
	var i;
	if(donneesMonstre == null)
		return;
	var array = analyseTactique(donneesMonstre,nom);
	if(array==null)
		return "";
	var str = "<table class='mh_tdborder' border='0' cellspacing='1' cellpadding='4'><tr class='mh_tdtitre'><td>Attaque</td><td>Esq. Parfaite</td><td>Touch�</td><td>Critique</td><td>D�g�ts</td></tr>";
	for(i=0;i<array.length;i++)
	{
		if(array[i][1]==100 && i>0)
		{
			needAutres=true;
			break;
		}
		if(i==1 && array[i][4]>0)
			str+= "<tr class=mh_tdpage><td><b>"+array[i][0]+"</b></td><td><b>"+getTexteAnalyse(array[i][5],array[i][1])+"%</b></td><td><b>"+getTexteAnalyse(array[i][5],array[i][2])+"%</b></td><td><b>"+getTexteAnalyse(array[i][5],array[i][3])+"%</b></td><td><b>"+getTexteAnalyse(array[i][6],array[i][4])+"</b></td></tr>";
		else if(i==0)
			str+= "<tr class=mh_tdpage><td><i>"+array[i][0]+"</i></td><td><i>"+getTexteAnalyse(array[i][5],array[i][1])+"%</i></td><td><i>"+getTexteAnalyse(array[i][5],array[i][2])+"%</i></td><td><i>"+getTexteAnalyse(array[i][5],array[i][3])+"%<i></td><td><b><i>"+getTexteAnalyse(array[i][6],array[i][4])+"<i></b></td></tr>";
		else
			str+= "<tr class=mh_tdpage><td>"+array[i][0]+"</td><td>"+getTexteAnalyse(array[i][5],array[i][1])+"%</td><td>"+getTexteAnalyse(array[i][5],array[i][2])+"%</td><td>"+getTexteAnalyse(array[i][5],array[i][3])+"%</td><td><b>"+getTexteAnalyse(array[i][6],array[i][4])+"</b></td></tr>";
	}
	if(needAutres)
	{
		if(i==array.length-1)
			str+= "<tr class=mh_tdpage><td>"+array[i][0]+"</td><td>"+getTexteAnalyse(array[i][5],array[i][1])+"%</td><td>"+getTexteAnalyse(array[i][5],array[i][2])+"%</td><td>"+getTexteAnalyse(array[i][5],array[i][3])+"%</td><td><b>"+getTexteAnalyse(array[i][6],array[i][4])+"</b></td></tr>";
		else if(i==1)
			str+= "<tr class=mh_tdpage><td><b>Toutes attaques</b></td><td>100%</td><td>0%</td><td>0%</td><td>0</td></tr>";
		else
			str+= "<tr class=mh_tdpage><td>Autres attaques</td><td>100%</td><td>0%</td><td>0%</td><td>0</td></tr>";
	}
	return str+"</table>";
}

function analyseTactique(donneesMonstre,nom) {
	try
	{
	var listeAttaques = [];
	var att = MZ_getValue(numTroll+".caracs.attaque");
	var attbmp = MZ_getValue(numTroll+".caracs.attaque.bmp");
	var attbmm = MZ_getValue(numTroll+".caracs.attaque.bmm");
	var mm = MZ_getValue(numTroll+".caracs.mm");
	var deg = MZ_getValue(numTroll+".caracs.degats");
	var degbmp = MZ_getValue(numTroll+".caracs.degats.bmp");
	var degbmm = MZ_getValue(numTroll+".caracs.degats.bmm");
	var vue = MZ_getValue(numTroll+".caracs.vue");
	var pv = MZ_getValue(numTroll+".caracs.pv");
	var esq = Math.max(MZ_getValue(numTroll+".caracs.esquive")-MZ_getValue(numTroll+".caracs.esquive.nbattaques"),0);
	var esqbonus = MZ_getValue(numTroll+".caracs.esquive.bm");
	var arm = MZ_getValue(numTroll+".caracs.armure");
	var armbmp = MZ_getValue(numTroll+".caracs.armure.bmp");
	var armbmm = MZ_getValue(numTroll+".caracs.armure.bmm");
	var modificateurEsquive = '';
	var modificateurArmure = '';
	var modificateurMagie = '';
	var modificateurEsquiveM = '';
	var modificateurArmureM = '';
	var pasDeSR=false;
	var esqM, attM, armM, degM;
	if(donneesMonstre==null || att==null || attbmp==null || attbmm==null || mm==null || deg==null || degbmp==null || degbmm==null || vue==null ||pv==null || esq==null || arm==null)
		return null;
	
	var td = document.createElement('td')
	td.innerHTML = bbcode(donneesMonstre[4]); // sans d�conner ? C'est quoi cette histoire ?
	var esqM = 0;
	try
	{
		esqM=Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
	} 
	catch(e)
	{
		esqM=Math.ceil(parseInt(td.firstChild.nodeValue));
		modificateurEsquive = '<';
		modificateurArmure = '<';
		modificateurMagie = '<';
	}
	
	td.innerHTML = bbcode(donneesMonstre[3]);
	var attM = 0;
	try
	{
		attM=Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
	} 
	catch(e)
	{
		attM=Math.ceil(parseInt(td.firstChild.nodeValue));
		modificateurEsquiveM = '>';
		modificateurArmureM = '>';
	}
	
	td.innerHTML = bbcode(donneesMonstre[5]);
	var degM = 0;
	try
	{
		degM=Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
	} 
	catch(e)
	{
		degM=Math.ceil(parseInt(td.firstChild.nodeValue));
		modificateurArmureM = '>';
	}
	
	td.innerHTML = bbcode(donneesMonstre[7]);
	var armM = 0;
	try
	{
		armM=Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
	} 
	catch(e)
	{
		armM=Math.ceil(parseInt(td.firstChild.nodeValue));
		modificateurArmure = '<';
	}
	
	var coeffSeuil = 0.95;
	try
	{
		td.innerHTML = bbcode(donneesMonstre[9]);
		var rm = parseInt(td.getElementsByTagName('b')[0].firstChild.nodeValue);
		var v = (rm / mm);
		var seuil = (rm < mm ? Math.max(10, Math.floor(v*50)) : Math.min(90, Math.floor(100 - 50/v)));
		coeffSeuil = (200-seuil)/200;
	}
	catch(e) 
	{
		modificateurMagie = '<';
		pasDeSR = true;
	}
	
	var chanceDEsquiveParfaite = chanceEsquiveParfaite(att,esqM,attbmp+attbmm,0);
	var chanceDeTouche = chanceTouche(att,esqM,attbmp+attbmm,0);
	var chanceDeCritique = chanceCritique(att,esqM,attbmp+attbmm,0);
	var degats = (((chanceDeTouche-chanceDeCritique)*Math.max(deg*2+degbmp+degbmm-armM,1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmp+degbmm-armM,1))/100);
	//str += "Attaque normale : Touch� "+chanceDeTouche+"% Critique "+chanceDeCritique+"% D�g�ts "+(((chanceDeTouche-chanceDeCritique)*Math.max(deg*2+degbmp+degbmm-arm,1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmp+degbmm-arm,1))/100);	
	listeAttaques.push(new Array("Attaque normale",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure));
	if(getSortComp("Vampirisme")>0)
	{
		var pour = getSortComp("Vampirisme");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(Math.floor(deg*2/3),esqM,attbmm,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(Math.floor(deg*2/3),esqM,attbmm,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(Math.floor(deg*2/3),esqM,attbmm,0)*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(deg*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmm,1)))/100;
		//str += "\nVampirisme : Touch� "+chanceDeTouche+"% Critique "+chanceDeCritique+"% D�g�ts "+(degats);
		listeAttaques.push(new Array("Vampirisme",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurMagie));
	}
	if(getSortComp("Botte Secr�te")>0)
	{
		var pour = getSortComp("Botte Secr�te");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(Math.floor(2*att/3),esqM,Math.floor((attbmp+attbmm)/2),0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(Math.floor(2*att/3),esqM,Math.floor((attbmp+attbmm)/2),0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(Math.floor(2*att/3),esqM,Math.floor((attbmp+attbmm)/2),0)*pour/100);
		degats = Math.round(((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(deg/2)*2+Math.floor((degbmp+degbmm)/2)-Math.floor(armM/2),1)+chanceDeCritique*Math.max(Math.floor(deg*1.5/2)*2+Math.floor((degbmp+degbmm)/2)-Math.floor(armM/2),1)))/100;
		//str += "\nBotte Secr�te : Touch� "+chanceDeTouche+"% Critique "+chanceDeCritique+"% D�g�ts "+(degats);
		listeAttaques.push(new Array("Botte Secr�te",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure));
	}
	if(getSortComp("Rafale Psychique")>0)
	{
		var pour = getSortComp("Rafale Psychique");
		chanceDEsquiveParfaite = 0;
		chanceDeTouche = Math.round(100*pour/100);
		chanceDeCritique = Math.round(0*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(deg*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmm,1)))/100;
		//str += "\nRafale Psychique : Touch� "+chanceDeTouche+"% Critique "+chanceDeCritique+"% D�g�ts "+(degats);
		listeAttaques.push(new Array("Rafale Psychique",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,'',pasDeSR?modificateurMagie:''));
	}
	if(getSortComp("Explosion")>0)
	{
		var pour = getSortComp("Explosion");
		chanceDEsquiveParfaite = 0;
		chanceDeTouche = Math.round(100*pour/100);
		chanceDeCritique = Math.round(0*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(1+deg/2+pv/20)*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(Math.floor(1+deg/2+pv/20)*1.5)*2+degbmm,1)))/100;
		//str += "\nRafale Psychique : Touch� "+chanceDeTouche+"% Critique "+chanceDeCritique+"% D�g�ts "+(degats);
		listeAttaques.push(new Array("Explosion",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,'',pasDeSR?modificateurMagie:''));
	}
	if(getSortComp("Projectile Magique")>0)
	{
		var pour = getSortComp("Projectile Magique");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(vue,esqM,attbmm,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(vue,esqM,attbmm,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(vue,esqM,attbmm,0)*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(vue/2)*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(Math.floor(vue/2)*1.5)*2+degbmm,1)))/100;
		//str += "\nProjectile Magique : Touch� "+chanceDeTouche+"% Critique "+chanceDeCritique+"% D�g�ts "+(degats);
		listeAttaques.push(new Array("Projectile Magique",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurMagie));
	}
	if(getSortComp("Fr�n�sie")>0)
	{
		var pour = getSortComp("Fr�n�sie");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att,esqM,attbmm+attbmp,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(att,esqM,attbmm+attbmp,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(att,esqM,attbmm+attbmp,0)*pour/100);
		degats = Math.round(((chanceDeTouche-chanceDeCritique)*2*Math.max((deg*2+degbmp+degbmm-armM),1)+chanceDeCritique*2*Math.max(Math.floor(deg*1.5)*2+degbmm+degbmp-armM,1)))/100;
		//str += "\nFr�n�sie : Touch� "+chanceDeTouche+"% Critique "+chanceDeCritique+"% D�g�ts "+(degats);
		listeAttaques.push(new Array("Fr�n�sie",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure));
	}
	if(getSortComp("Charger")>0)
	{
		var pour = getSortComp("Charger");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att,esqM,attbmm+attbmp,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(att,esqM,attbmm+attbmp,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(att,esqM,attbmm+attbmp,0)*pour/100);
		var degats = Math.round(((chanceDeTouche-chanceDeCritique)*Math.max((deg*2+degbmp+degbmm-armM),1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmm+degbmp-armM,1)))/100;
		//str += "\nCharge : Touch� "+chanceDeTouche+"% Critique "+chanceDeCritique+"% D�g�ts "+(degats);
		listeAttaques.push(new Array("Charger",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure));
	}
	if(getSortComp("Griffe du Sorcier")>0)
	{
		var pour = getSortComp("Griffe du Sorcier");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att,esqM,attbmm,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(att,esqM,attbmm,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(att,esqM,attbmm,0)*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(deg/2)*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(Math.floor(deg/2)*1.5)*2+degbmm,1)))/100;
		//str += "\nGriffe du Sorcier : Touch� "+chanceDeTouche+"% Critique "+chanceDeCritique+"% D�g�ts "+(degats);
		listeAttaques.push(new Array("Griffe du Sorcier",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurMagie));
	}
	if(getSortComp("Attaque Pr�cise",1)>0)
	{
		var niveau = 5;
		var oldPour = 0;
		var chanceDEsquiveParfaite = 0;
		var chanceDeTouche = 0;
		var chanceDeCritique = 0;
		degats = 0;
		while(niveau>0)
		{
			var pour = getSortComp("Attaque Pr�cise",niveau);
			if(pour>oldPour)
			{
				var chanceDEsquiveParfaiteNiveau = chanceEsquiveParfaite(Math.min(att+3*niveau,Math.floor(att*1.5)),esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				var chanceDeToucheNiveau = chanceTouche(Math.min(att+3*niveau,Math.floor(att*1.5)),esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				var chanceDeCritiqueNiveau = chanceCritique(Math.min(att+3*niveau,Math.floor(att*1.5)),esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				chanceDEsquiveParfaite += chanceDEsquiveParfaiteNiveau;
				chanceDeTouche += chanceDeToucheNiveau;
				chanceDeCritique += chanceDeCritiqueNiveau;
				degats += (((chanceDeToucheNiveau-chanceDeCritiqueNiveau)*Math.max((deg*2+degbmp+degbmm-armM),1)+chanceDeCritiqueNiveau*Math.max(Math.floor(deg*1.5)*2+degbmm+degbmp-armM,1))/100);
				oldPour = pour;
			}
			niveau--;
		}
		//str += "\nAttaque Pr�cise : Touch� "+(Math.round(chanceDeTouche*100)/100)+"% Critique "+(Math.round(chanceDeCritique*100)/100)+"% D�g�ts "+Math.round(degats*100)/100;
		listeAttaques.push(new Array("Attaque Pr�cise",chanceDEsquiveParfaite,Math.round(chanceDeTouche*100)/100,Math.round(chanceDeCritique*100)/100,Math.round(degats*100)/100,modificateurEsquive,modificateurArmure));
	}
	if(getSortComp("Coup de Butoir",1)>0)
	{
		var niveau = 5;
		var oldPour =0;
		var chanceDEsquiveParfaite = 0;
		var chanceDeTouche=0;
		var chanceDeCritique=0;
		degats=0;
		while(niveau>0)
		{
			var pour = getSortComp("Coup de Butoir",niveau);
			if(pour>oldPour)
			{
				var chanceDEsquiveParfaiteNiveau = chanceEsquiveParfaite(att,esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				var chanceDeToucheNiveau = chanceTouche(att,esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				var chanceDeCritiqueNiveau = chanceCritique(att,esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				chanceDEsquiveParfaite += chanceDEsquiveParfaiteNiveau;
				chanceDeTouche += chanceDeToucheNiveau;
				chanceDeCritique += chanceDeCritiqueNiveau;
				degats += (((chanceDeToucheNiveau-chanceDeCritiqueNiveau)*Math.max((Math.min(Math.floor(deg*1.5),deg+3*niveau)*2+degbmp+degbmm-armM),1)+chanceDeCritiqueNiveau*Math.max(Math.floor(Math.min(Math.floor(deg*1.5),deg+3*niveau)*1.5)*2+degbmm+degbmp-armM,1))/100);
				oldPour = pour;
			}
			niveau--;
		}
		//str += "\nCoup de Butoir : Touch� "+(Math.round(chanceDeTouche*100)/100)+"% Critique "+(Math.round(chanceDeCritique*100)/100)+"% D�g�ts "+Math.round(degats*100)/100;
		listeAttaques.push(new Array("Coup de Butoir",chanceDEsquiveParfaite,Math.round(chanceDeTouche*100)/100,Math.round(chanceDeCritique*100)/100,Math.round(degats*100)/100,modificateurEsquive,modificateurArmure));
	}
	listeAttaques.sort(function(a,b){var diff = parseInt(100*b[4])-parseInt(100*a[4]);if(diff==0) return parseInt(b[1])-parseInt(a[1]); return diff;});
	if(nom.toLowerCase().indexOf("m�gac�phale")==-1)
	{
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(attM,esq,0, esqbonus));
		chanceDeTouche = Math.round(chanceTouche(attM,esq,0, esqbonus));
		chanceDeCritique = Math.round(chanceCritique(attM,esq,0, esqbonus));
	}
	else
	{
		chanceDEsquiveParfaite = 0;
		chanceDeTouche = 100;
		chanceDeCritique = 0;
	}
	degats = Math.round(((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(degM)*2-arm,1)+chanceDeCritique*Math.max(Math.floor(Math.floor(degM)*1.5)*2-arm*2-armbmm-armbmp,1)))/100;

	listeAttaques.unshift(new Array("Monstre",Math.round(chanceDEsquiveParfaite*100)/100,Math.round(chanceDeTouche*100)/100,Math.round(chanceDeCritique*100)/100,Math.round(degats*100)/100,modificateurEsquive,modificateurArmure));
	return listeAttaques;
	}
	catch(e) { window.alert(e);}
	}

/***********************************************
Les popups
***********************************************/

var tagPopup = null;

function initTagPopup() {
	if(tagPopup!=null) return;
	tagPopup = document.createElement('div');
	tagPopup.id = 'tagPopup';
	tagPopup.classNAme = 'mh_textbox';
	tagPopup.style = 'position: absolute;'
					+'border: 1px solid #000000;'
					+'visibility: hidden;'
					+'display: inline;'
					+'z-index: 3;'
					+'max-width: 400px;';
	document.body.appendChild(tagPopup);
	}

function showTagPopup(evt) {
	var texte = this.texteinfo;
	tagPopup.innerHTML = texte;
	tagPopup.style.left = (evt.pageX+15)+'px';
	tagPopup.style.top = evt.pageY+'px';
	tagPopup.style.visibility = "visible";
	}

function hideTagPopup() {
	tagPopup.style.visibility = 'hidden';
	}

function createTagImage(url, text) {
	var img = document.createElement('img');
	img.src = url;
	img.align = 'ABSMIDDLE'; // WARNING - Obsolete
	img.texteinfo = text;
	img.onmouseover = showTagPopup;
	img.onmouseout = hideTagPopup;
	return img;
	}

/***********************************************
les tags de trolls
***********************************************/

var nbTagFile = 0;
var nbTagFileAnalyzed = 0;
var infoTagTrolls = [];
var infoTagGuildes = [];

function performTagComputation()
{
	var nbGuildes = document.evaluate("//a[contains(@href,'javascript:EAV') or contains(@href,'javascript:EnterAllianceView')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
	var nbTrolls = document.evaluate("//a[contains(@href,'javascript:EPV') or contains(@href,'javascript:EnterPJView')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
	if(nbTrolls>0 || nbGuildes>0)
	{
		initTagPopup();
		getTag(analyseTags,showTags);
	}
}

function getTag(fonctionAnalyse,fonctionAffiche)
{
	try
	{
		if(MZ_getValue(numTroll+'.TAGSURL') == null || MZ_getValue(numTroll+'.TAGSURL')=='')
			return false;
		var tagsurl = MZ_getValue(numTroll+'.TAGSURL');
		var listeTagsURL = tagsurl.split("$");
		nbTagFile = listeTagsURL.length;
		for(var i=0;i<listeTagsURL.length;i++)
		{
			if(listeTagsURL[i].toLowerCase().indexOf("http")==0)
			{
				//appendNewScript(listeTagsURL[i]);
				MZ_xmlhttpRequest({
				    method: 'GET',
				    url: listeTagsURL[i],
				    headers: {
				        'User-agent': 'Mozilla/4.0 (compatible) Mountyzilla',
				        'Accept': 'application/xml,text/xml',
				    },
				    onload: function(responseDetails) {
						try
						{
							fonctionAnalyse(responseDetails.responseText);
						}
						catch(e)
						{
							window.alert(e);
						}
						nbTagFileAnalyzed++;
						if(nbTagFileAnalyzed==nbTagFile)
						{
							fonctionAffiche();
						}
					},
					onerror: function(responseDetails) {
						nbTagFileAnalyzed++;
						if(nbTagFileAnalyzed==nbTagFile)
							fonctionAffiche();
					},
				});
			}
			else
			{
				nbTagFileAnalyzed++;
				if(nbTagFileAnalyzed==nbTagFile)
					fonctionAffiche();
			}
		}
	}
	catch(e) {window.alert(e);}
}

function showTags()
{
	try
	{
		if(infoTagGuildes.length>0)
		{ // nom mais quelle brutasse !!!
			var nodes = document.evaluate("//a[contains(@href,'javascript:EAV') or contains(@href,'javascript:EnterAllianceView')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			for(var i=0;i<nodes.snapshotLength;i++)
			{
				var node = nodes.snapshotItem(i);
				var link = node.getAttribute('href');
				var guildeID = parseInt(link.substring(link.indexOf('(')+1,link.indexOf(',')));
				var infos = infoTagGuildes[guildeID];
				if(infos) 
				{
					for(var j=0;j<infos.length;j++)
					{
						insertAfter(node,createTagImage(infos[j][0], infos[j][1]));
						insertAfter(node,document.createTextNode(" "));
					}
				}	
			}
		}
		if(infoTagTrolls.length>0)
		{
			var nodes = document.evaluate("//a[contains(@href,'javascript:EPV') or contains(@href,'javascript:EnterPJView')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			for(var i=0;i<nodes.snapshotLength;i++)
			{
				var node = nodes.snapshotItem(i);
				var link = node.getAttribute('href').replace(/'/g,"");
				var trollID = parseInt(link.substring(link.indexOf('(')+1,link.indexOf(')')));
				var infos = infoTagTrolls[trollID];
				if(infos) 
				{
					for(var j=0;j<infos.length;j++)
					{
						insertAfter(node,createTagImage(infos[j][0], infos[j][1]));
						insertAfter(node,document.createTextNode(" "));
					}
				}	
			}
		}
	}
	catch(e) {window.alert(e);}
}

function analyseTags(data)
{
	var icones = new Array();
	var descriptions = new Array();
	
	var lignes = data.split("\n");
	for(var i=0;i<lignes.length;i++)
	{
		try
		{
			var data = lignes[i].split(";");
			if(data.length<=1)
				continue;
			if(data[0]=="I")
			{
				icones.push(lignes[i].substring(lignes[i].indexOf(";")+1));
			}
			else if(data[0]=="D")
			{
				descriptions.push(bbcode(lignes[i].substring(lignes[i].indexOf(";")+1)));
			}
			else if(data[0]=="T")
			{
				if(data.length<=2)
				continue;
				var id = data[1]*1;
				var icone = icones[data[2]*1];
				var texte = "";
				for(var j=3;j<data.length;j++)
					texte+=descriptions[data[j]*1];
				var info = new Array(icone,texte);
				if(infoTagTrolls[id] == null)
					infoTagTrolls[id] = new Array();
				infoTagTrolls[id].push(info);
			}
			else if(data[0]=="G")
			{
				if(data.length<=2)
					continue;
				var id = data[1]*1;
				var icone = icones[data[2]*1];
				var texte = "";
				for(var j=3;j<data.length;j++)
					texte+=descriptions[data[j]*1];
				var info = new Array(icone,texte);
				if(infoTagGuildes[id] == null)
					infoTagGuildes[id] = new Array();
				infoTagGuildes[id].push(info);
			}
		}
		catch(e)
		{
			window.alert(e);
			break;
		}
	}
}

if(!isPage("MH_Play/Play_vue.php") && !isPage("MH_Play/Play_menu.php"))
	performTagComputation();

