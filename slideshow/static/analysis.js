/**
 * Wrapper around JSON exported Echo Nest Remix data
 * 
 * Note that all clocks here are in milliseconds, not seconds
 * (start, duration).
 * 
 */

function Analysis(json) {
	this.data = json;
	
	// How sure we must be about the beat to accept it
	this.minBeatConfidence = 0.7;
	
}

Analysis.prototype = {
	
    /**
     * Find next beat from the array of all beats.
     * 
     * @param clock Clock position
     * 
     * @param skip Skip rate. 1= every beat, 2 = every second beat
     * 
     * @return AudioQuantum object
     */
    findNextBeat :function(clock, skip) {
        
        var beat = 0;
       
		var i = 0;
		
		var confidenceThreshold = this.minBeatConfidence;
        
        this.data.beats.forEach(function(t) {
        
		
		  if(t.confidence < confidenceThreshold) {
		  	return;
		  }
          //if(i % skip != 0) {
         //     return;
          //}
        
          //console.log("Test: " + clock + " " + t);
          if(t.start < clock) {           
            beat = t;
          }
          
          i+=1;
        });
        
        return beat;
    },
    
    /**
     * Find last beat from the array of all beats.
     * 
     * @param clock Clock position
     * 
     * @param skip Skip rate. 1= every beat, 2 = every second beat
     * 
     * @return AudioQuantum object
     */
    findLastBeat :function(clock, skip) {
        
        var beat = null;
        
        var beats = this.data.beats;
				
		var confidenceThreshold = this.minBeatConfidence;
		
        var i;
        for(i=0; i<beats.length;i++) {
            var t = beats[i];         
    
            if(t.confidence < confidenceThreshold) {
                continue;
            }			
			              
            if(t.start > clock) {
                break;
            }           
            beat = t;                       
        }
                
        return beat;
    },
        
    
    /**
     * Calculate beat intensivity as linear function.
     * 
     *  Like this:
     *     
     *  |\
     *  |  \
     *  |    \
     *  |     \.........[window]
     *  
     * 
     * @param {Object} clock animation time in ms
     * @param {Object} window 0.... 100% beat intensivity in ms
     */
    calculateBeatIntensivity : function(clock, window, skip) {
        
        var beat = this.findLastBeat(clock, skip);
		
		if(!beat) {
			return 0;
		}
        
        var distance = clock - beat.start;       
            
        // -1 ... 1 intensivity within beat window
        var normalized = (window-distance) / window;                    

        // console.log("Clock:" + clock + " beat:" + beat + " window:" + window + " skip:" + skip + " distance:" + distance);

        return normalized;

    }
    
}

