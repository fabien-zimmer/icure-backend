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

//
// Ce fichier a été généré par l'implémentation de référence JavaTM Architecture for XML Binding (JAXB), v2.2.8-b130911.1802 
// Voir <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a> 
// Toute modification apportée à ce fichier sera perdue lors de la recompilation du schéma source. 
// Généré le : 2015.11.10 à 11:53:40 AM CET 
//


package org.taktik.icure.services.external.rest.v1.dto.be.ehealth.kmehr.v20150301.be.fgov.ehealth.standards.kmehr.cd.v1;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Classe Java pour CD-ITEM-CARENETvalues.
 * 
 * <p>Le fragment de schéma suivant indique le contenu attendu figurant dans cette classe.
 * <p>
 * <pre>
 * &lt;simpleType name="CD-ITEM-CARENETvalues">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="accidenttype"/>
 *     &lt;enumeration value="advisingphysician"/>
 *     &lt;enumeration value="agreement"/>
 *     &lt;enumeration value="authorisedextensionenddatetime"/>
 *     &lt;enumeration value="begindatetime"/>
 *     &lt;enumeration value="billingdestinationnumber"/>
 *     &lt;enumeration value="insurancydetails"/>
 *     &lt;enumeration value="insurancystatus"/>
 *     &lt;enumeration value="messagenumber"/>
 *     &lt;enumeration value="messagetype"/>
 *     &lt;enumeration value="missingdocument"/>
 *     &lt;enumeration value="mutationbegindatetime"/>
 *     &lt;enumeration value="mutationdestination"/>
 *     &lt;enumeration value="nationalinsurance"/>
 *     &lt;enumeration value="otheradmission"/>
 *     &lt;enumeration value="protectionmeasure"/>
 *     &lt;enumeration value="refusalreason"/>
 *     &lt;enumeration value="requestedextensiondatetime"/>
 *     &lt;enumeration value="requestedextensionenddatetime"/>
 *     &lt;enumeration value="siscardadjustment"/>
 *     &lt;enumeration value="siscarderror"/>
 *     &lt;enumeration value="socialcategory"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "CD-ITEM-CARENETvalues")
@XmlEnum
public enum CDITEMCARENETvalues {

    @XmlEnumValue("accidenttype")
    ACCIDENTTYPE("accidenttype"),
    @XmlEnumValue("advisingphysician")
    ADVISINGPHYSICIAN("advisingphysician"),
    @XmlEnumValue("agreement")
    AGREEMENT("agreement"),
    @XmlEnumValue("authorisedextensionenddatetime")
    AUTHORISEDEXTENSIONENDDATETIME("authorisedextensionenddatetime"),
    @XmlEnumValue("begindatetime")
    BEGINDATETIME("begindatetime"),
    @XmlEnumValue("billingdestinationnumber")
    BILLINGDESTINATIONNUMBER("billingdestinationnumber"),
    @XmlEnumValue("insurancydetails")
    INSURANCYDETAILS("insurancydetails"),
    @XmlEnumValue("insurancystatus")
    INSURANCYSTATUS("insurancystatus"),
    @XmlEnumValue("messagenumber")
    MESSAGENUMBER("messagenumber"),
    @XmlEnumValue("messagetype")
    MESSAGETYPE("messagetype"),
    @XmlEnumValue("missingdocument")
    MISSINGDOCUMENT("missingdocument"),
    @XmlEnumValue("mutationbegindatetime")
    MUTATIONBEGINDATETIME("mutationbegindatetime"),
    @XmlEnumValue("mutationdestination")
    MUTATIONDESTINATION("mutationdestination"),
    @XmlEnumValue("nationalinsurance")
    NATIONALINSURANCE("nationalinsurance"),
    @XmlEnumValue("otheradmission")
    OTHERADMISSION("otheradmission"),
    @XmlEnumValue("protectionmeasure")
    PROTECTIONMEASURE("protectionmeasure"),
    @XmlEnumValue("refusalreason")
    REFUSALREASON("refusalreason"),
    @XmlEnumValue("requestedextensiondatetime")
    REQUESTEDEXTENSIONDATETIME("requestedextensiondatetime"),
    @XmlEnumValue("requestedextensionenddatetime")
    REQUESTEDEXTENSIONENDDATETIME("requestedextensionenddatetime"),
    @XmlEnumValue("siscardadjustment")
    SISCARDADJUSTMENT("siscardadjustment"),
    @XmlEnumValue("siscarderror")
    SISCARDERROR("siscarderror"),
    @XmlEnumValue("socialcategory")
    SOCIALCATEGORY("socialcategory");
    private final String value;

    CDITEMCARENETvalues(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static CDITEMCARENETvalues fromValue(String v) {
        for (CDITEMCARENETvalues c: CDITEMCARENETvalues.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
