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

function checkInbox(){
	//mi posiziono sul nodo 'messaggi'
	var msgBoxRef = myDataRef.child('messaggi');
	//cerco tutti i messaggi che hanno come destinatario il codice fiscale dell'utente corrente
	msgBoxRef.orderByChild('destinatario').equalTo(codiceFiscale).on('child_added',function(snapshot){
		var messaggio=snapshot.val();
		var msg=messaggio;
		//ricavo la chiave primaria del messaggio
		var msgKey=snapshot.key();
		//configuro il flag di lettura del messaggio
		var msgClass=msg.letto?'letto':'nuovo';
		var testo=msg.testo;
		var data=new Date(msg.time);
		//mi posiziono sul nodo 'elencoCondomini'
		recipientRef=myDataRef.child('elencoCondomini');
		//carico la inbox dell'utente corrente
		recipientRef.orderByChild('codiceFiscale').equalTo(msg.destinatario).once('value',function(snapDestinatario){
			snapDestinatario.forEach(function(recipient){
				var destinatario=recipient.val();
				for(var prop in destinatario.inbox) {
				    if(destinatario.inbox.hasOwnProperty(prop)) {
				    	//se il messaggio è contenuto nella inbox del destinatario, lo visualizzo
				        if(destinatario.inbox[prop].idMessaggio === msgKey) {
				        	//carico i dati del mittente
				        	recipientRef.orderByChild('codiceFiscale').equalTo(msg.mittente).once('value', function(snapshot2){
								snapshot2.forEach(function(recipient){
									var destinatario=recipient.val();
									//aggiungo il messaggio alla lista di inbox
									$('#lst-inbox').append('<li class="'+msgClass+'" id="'+msgKey+'">'+data.getDate()+'/'+(data.getMonth()+1)+'/'+data.getFullYear()+' '+data.getHours()+':'+data.getMinutes()+' - '+destinatario.nome+' '+destinatario.cognome+' - '+msg.oggetto+'<div hidden>'+testo+'</div></li>');
									//aggiorno la view per riformattare la lista in maniera pulita
									$('#lst-inbox').listview('refresh');
									//aggiungo al click la funzione di visulalizzazione del messaggio e di aggiornamento del relativo stato di lettura
									$('#lst-inbox li#'+msgKey).click(function(){
										$(this).children('div').toggle();
										msgBoxRef.child(msgKey).update({'letto':true});
										$(this).addClass('letto').removeClass('nuovo');
									});
									//aggiungo all'evento swipe la funzione che gestisce la cancellazione del messaggio
									$('#lst-inbox li#'+msgKey).on('swiperight swipeleft',function(){
										var listitem = $( this );
								        confirmAndDelete( listitem, '#lst-inbox' );
									});
								})
							});					        
				        }
				    }
				}
			});
		});			
	});
}