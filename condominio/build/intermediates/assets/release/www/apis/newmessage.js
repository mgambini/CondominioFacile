/* Copyright (c) 2015 Mobile Developer Solutions. All rights reserved.
 * This software is available under the MIT License:
 * The MIT License
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, 
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software 
 * is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies 
 * or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

function selectListaUtentiPopulate(){
	myDataRef.child(idCondominio+'/elencoCondomini').orderByChild("codiceFiscale").once('value', function(snapshot) {
		var utente=snapshot;
		snapshot.forEach(function(childSnapshot) {
			var key = childSnapshot.key();
		    var childData = childSnapshot.val();
			var cf=childData.codiceFiscale;
			myDataRef.child('elencoCondomini').orderByChild('codiceFiscale').equalTo(cf).once('value', function(snapAnagrafica){
				snapAnagrafica.forEach(function(anagrafica){
					var listItem=anagrafica.val().nome+' '+anagrafica.val().cognome;
					$('#listaUtenti').append('<option value="'+anagrafica.val().codiceFiscale+'">'+listItem+'</option>');
					$('#listaUtenti').selectmenu('refresh');
				});
			});
		});
	});
}

function inviaMessaggio(){
	var destinatario=$('#listaUtenti').val();
	var oggetto=$('#oggetto').val();
	var testo=$('#testo').val();
	var refMessaggi=myDataRef.child('messaggi');
	var time=new Date().getTime();
	var messaggio=refMessaggi.push({
		'mittente':codiceFiscale,
		'destinatario':destinatario,
		'oggetto':oggetto,
		'testo':testo,
		'letto':false,
		'time':time
		});
	var idMessaggio=messaggio.name();
	var senderRef=myDataRef.child('elencoCondomini/'+idUtente+'/outbox');
	senderRef.push({'idMessaggio':idMessaggio});
	
	myDataRef.child('elencoCondomini').orderByChild('codiceFiscale').equalTo(destinatario).once('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var destKey=childSnapshot.key();
			var recipientRef=myDataRef.child('elencoCondomini/'+destKey+'/inbox');
			recipientRef.push({'idMessaggio':idMessaggio});
		});
	});
	clearMailForm();
	$('#click-outbox').click();
}

function clearMailForm(){
	$('#listaUtenti').prop('selectedIndex',-1);
	$('#oggetto').val('');
	$('#testo').val('');
}