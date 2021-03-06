/*
 * Copyright (C) 2018 Taktik SA
 *
 * This file is part of iCureBackend.
 *
 * iCureBackend is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2 as published by
 * the Free Software Foundation.
 *
 * iCureBackend is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with iCureBackend.  If not, see <http://www.gnu.org/licenses/>.
 */


package org.taktik.icure.be.drugs.dto;
// Generated Feb 27, 2008 11:38:04 AM by Hibernate Tools 3.2.0.CR1



/**
 * CompositionId generated by hbm2java
 */
public class CompositionId  implements java.io.Serializable {

	private static final long serialVersionUID = 1L;
    private String mppId;
    private int rank;
    private String lang;
	private String ppid;

    public CompositionId() {
    }

    public CompositionId(String mppId, int rank, String lang, String ppid) {
       this.mppId = mppId;
       this.rank = rank;
       this.lang = lang;
		this.ppid = ppid;
    }
   
    public String getMppId() {
        return this.mppId;
    }
    
    public void setMppId(String mppId) {
        this.mppId = mppId;
    }
    public int getRank() {
        return this.rank;
    }
    
    public void setRank(int rank) {
        this.rank = rank;
    }
    public String getLang() {
        return this.lang;
    }
    
    public void setLang(String lang) {
        this.lang = lang;
    }

	public String getPpid() {
		return ppid;
	}

	public void setPpid(String ppid) {
		this.ppid = ppid;
	}

	public boolean equals(Object other) {
         if ( (this == other ) ) return true;
		 if ( (other == null ) ) return false;
		 if ( !(other instanceof CompositionId) ) return false;
		 CompositionId castOther = ( CompositionId ) other; 
         
		 return ( (this.getMppId()==castOther.getMppId()) || ( this.getMppId()!=null && castOther.getMppId()!=null && this.getMppId().equals(castOther.getMppId()) ) )
 && (this.getRank()==castOther.getRank())
 && ( (this.getLang()==castOther.getLang()) || ( this.getLang()!=null && castOther.getLang()!=null && this.getLang().equals(castOther.getLang()) ) );
   }
   
   public int hashCode() {
         int result = 17;
         
         result = 37 * result + ( getMppId() == null ? 0 : this.getMppId().hashCode() );
         result = 37 * result + this.getRank();
         result = 37 * result + ( getLang() == null ? 0 : this.getLang().hashCode() );
         return result;
   }   


}


