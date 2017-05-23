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

function checkOutbox(){
	var msgBoxRef = myDataRef.child('messaggi');
	msgBoxRef.orderByChild('mittente').equalTo(codiceFiscale).on('child_added',function(snapshot){
		messaggio=snapshot.val();
			var msg=messaggio;
			var msgKey=snapshot.key();
			var msgClass=msg.letto?'letto':'nuovo';
			var testo=msg.testo;
			var data=new Date(msg.time);
			senderRef=myDataRef.child('elencoCondomini');
			senderRef.orderByChild('codiceFiscale').equalTo(msg.mittente).once('value',function(snapMittente){
				snapMittente.forEach(function(sender){
					var mittente=sender.val();
					for(var prop in mittente.outbox) {
					    if(mittente.outbox.hasOwnProperty(prop)) {
					        if(mittente.outbox[prop].idMessaggio === msgKey) {
					        	senderRef.orderByChild('codiceFiscale').equalTo(msg.destinatario).once('value', function(snapshot2){
									snapshot2.forEach(function(sender){
										var destinatario=sender.val();
										$('#lst-outbox').append('<li class="'+msgClass+'" id="'+msgKey+'">'+data.getDate()+'/'+(data.getMonth()+1)+'/'+data.getFullYear()+' '+data.getHours()+':'+data.getMinutes()+' - '+destinatario.nome+' '+destinatario.cognome+' - '+msg.oggetto+'<div hidden>'+testo+'</div></li>');
										$('#lst-outbox').listview('refresh');
										$('#lst-outbox li#'+msgKey).click(function(){
											$(this).children('div').toggle();
										});
										$('#lst-outbox li#'+msgKey).on('swiperight swipeleft',function(){
											var listitem = $( this );
									        confirmAndDelete( listitem, '#lst-outbox' );
										});
									})
								});					        }
					    }
					}
				});
			});			
	});
}