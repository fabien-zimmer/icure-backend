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

package org.taktik.icure.dto.filter.predicate;

import java.util.List;

import org.taktik.icure.entities.base.Identifiable;

public class OrPredicate implements Predicate {
	List<Predicate> predicates;

	public OrPredicate(List predicates) {
		this.predicates = predicates;
	}

	public OrPredicate() {
	}

	public List getPredicates() {
		return predicates;
	}

	public void setPredicates(List predicates) {
		this.predicates = predicates;
	}

	@Override
	public boolean apply(Identifiable<String> input) {
		for (Predicate p : predicates) {
			if (p.apply(input)) {
				return true;
			}
		}
		return false;
	}
}
