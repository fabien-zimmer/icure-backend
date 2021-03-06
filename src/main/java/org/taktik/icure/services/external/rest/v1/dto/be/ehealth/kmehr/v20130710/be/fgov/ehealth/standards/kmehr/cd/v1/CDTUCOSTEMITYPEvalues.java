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
// Généré le : 2015.03.05 à 11:48:09 AM CET 
//


package org.taktik.icure.services.external.rest.v1.dto.be.ehealth.kmehr.v20130710.be.fgov.ehealth.standards.kmehr.cd.v1;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Classe Java pour CD-TUCO-STEMITYPEvalues.
 * 
 * <p>Le fragment de schéma suivant indique le contenu attendu figurant dans cette classe.
 * <p>
 * <pre>
 * &lt;simpleType name="CD-TUCO-STEMITYPEvalues">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="stemipci"/>
 *     &lt;enumeration value="stemirescue"/>
 *     &lt;enumeration value="stemilate"/>
 *     &lt;enumeration value="nonstemiurgent"/>
 *     &lt;enumeration value="nonstemielective"/>
 *     &lt;enumeration value="nonstemilate"/>
 *     &lt;enumeration value="emergentpci"/>
 *     &lt;enumeration value="electivepci"/>
 *     &lt;enumeration value="outofhospitalarrest"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "CD-TUCO-STEMITYPEvalues")
@XmlEnum
public enum CDTUCOSTEMITYPEvalues {

    @XmlEnumValue("stemipci")
    STEMIPCI("stemipci"),
    @XmlEnumValue("stemirescue")
    STEMIRESCUE("stemirescue"),
    @XmlEnumValue("stemilate")
    STEMILATE("stemilate"),
    @XmlEnumValue("nonstemiurgent")
    NONSTEMIURGENT("nonstemiurgent"),
    @XmlEnumValue("nonstemielective")
    NONSTEMIELECTIVE("nonstemielective"),
    @XmlEnumValue("nonstemilate")
    NONSTEMILATE("nonstemilate"),
    @XmlEnumValue("emergentpci")
    EMERGENTPCI("emergentpci"),
    @XmlEnumValue("electivepci")
    ELECTIVEPCI("electivepci"),
    @XmlEnumValue("outofhospitalarrest")
    OUTOFHOSPITALARREST("outofhospitalarrest");
    private final String value;

    CDTUCOSTEMITYPEvalues(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static CDTUCOSTEMITYPEvalues fromValue(String v) {
        for (CDTUCOSTEMITYPEvalues c: CDTUCOSTEMITYPEvalues.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
